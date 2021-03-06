/*
 * Copyright (C) 2019 The "mysteriumnetwork/mysterium-vpn-mobile" Authors.
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

import { StatisticsEvent } from '../events'
import StatisticsConfig from '../statistics-config'
import { StatisticsSender } from './statistics-sender'

class ConsoleSender implements StatisticsSender {
  constructor (private config: StatisticsConfig) {

  }

  public async send (event: StatisticsEvent): Promise<void> {
    event.application = this.config.applicationInfo

    console.log('Sending statistics event to null', event)
  }
}

export default ConsoleSender
