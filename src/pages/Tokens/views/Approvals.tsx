// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { ApprovalSlide } from '../../../components/Slides/ApprovalSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  ApprovalFilters,
  FF_Paths,
  IDataTableRecord,
  IPagedTokenApprovalResponse,
  ITokenApproval,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasApprovalEvent } from '../../../utils/wsEvents';

export const TokensApprovals: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Token approvals
  const [tokenApprovals, setTokenApprovals] = useState<ITokenApproval[]>();
  // Token approvals totals
  const [tokenApprovalsTotal, setTokenApprovalsTotal] = useState(0);
  const [viewApproval, setViewApproval] = useState<ITokenApproval>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted &&
      slideID &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenApprovals}?localid=${slideID}`
      )
        .then((approvalRes: ITokenApproval[]) => {
          isMounted &&
            approvalRes.length === 1 &&
            setViewApproval(approvalRes[0]);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Token approvals
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenApprovals
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((tokenApprovalRes: IPagedTokenApprovalResponse) => {
          setTokenApprovals(tokenApprovalRes.items);
          setTokenApprovalsTotal(tokenApprovalRes.total);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    dateFilter,
    filterString,
    lastRefreshTime,
    isMounted,
  ]);

  const tokenApprovalColHeaders = [
    t('id'),
    t('signingKey'),
    t('operator'),
    t('pool'),
    t('protocolID'),
    t('approved?'),
    t('created'),
  ];
  const tokenApprovalRecords: IDataTableRecord[] | undefined =
    tokenApprovals?.map((approval, idx) => ({
      key: idx.toString(),
      columns: [
        {
          value: <HashPopover address={approval.localId} />,
        },
        {
          value: <HashPopover address={approval.key} />,
        },
        {
          value: <HashPopover address={approval.operator} />,
        },
        {
          value: <HashPopover address={approval.pool} />,
        },
        {
          value: <HashPopover address={approval.protocolId} />,
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={
                approval.approved
                  ? t('yes').toUpperCase()
                  : t('no').toUpperCase()
              }
            />
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(approval.created)} />
          ),
        },
      ],
      onClick: () => {
        setViewApproval(approval);
        setSlideSearchParam(approval.localId);
      },
    }));

  return (
    <>
      <Header
        title={t('approvals')}
        subtitle={t('tokens')}
        showRefreshBtn={hasApprovalEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            filter={
              <FilterButton
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
            }
          />
          <DataTable
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={tokenApprovalRecords}
            columnHeaders={tokenApprovalColHeaders}
            paginate={true}
            emptyStateText={t('noTokenApprovalsToDisplay')}
            dataTotal={tokenApprovalsTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={ApprovalFilters}
        />
      )}
      {viewApproval && (
        <ApprovalSlide
          approval={viewApproval}
          open={!!viewApproval}
          onClose={() => {
            setViewApproval(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};