/*
 * Copyright (C) 2018 The "mysteriumnetwork/mysterium-vpn-mobile" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ConnectionStatusDTO } from 'mysterium-tequilapi'
import { FetcherBase } from './fetcher-base'

export class StatusFetcher extends FetcherBase<ConnectionStatusDTO> {
  constructor (
    private connectionStatus: () => Promise<ConnectionStatusDTO>,
    update: (data: ConnectionStatusDTO) => void
  ) {
    super('ConnectionStatus', update)
  }

  protected async fetch (): Promise<ConnectionStatusDTO> {
    return this.connectionStatus()
  }
}
