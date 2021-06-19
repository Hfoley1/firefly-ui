// Copyright © 2021 Kaleido, Inc.
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

import React, { Dispatch, SetStateAction } from 'react';
import { DataView, CreatedFilterOptions } from '../interfaces';

export interface IApplicationContext {
  identity: string;
  orgName: string;
  lastEvent: any;
  setLastEvent: Dispatch<SetStateAction<any>>;
  dataView: DataView;
  setDataView: Dispatch<SetStateAction<DataView>>;
  createdFilter: CreatedFilterOptions;
  setCreatedFilter: Dispatch<SetStateAction<CreatedFilterOptions>>;
}

export const ApplicationContext = React.createContext<IApplicationContext>({
  identity: '',
  orgName: '',
  dataView: 'list',
  setDataView: () => {
    /* default value */
  },
  createdFilter: '24hours',
  setCreatedFilter: () => {
    /* default value */
  },
  lastEvent: undefined,
  setLastEvent: () => {
    /* default value */
  },
});