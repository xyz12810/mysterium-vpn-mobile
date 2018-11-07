/*
 * Copyright (C) 2018 The 'MysteriumNetwork/mysterion' Authors.
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

import { action, computed } from 'mobx'
import { observer } from 'mobx-react/native'
import { ProposalDTO } from 'mysterium-tequilapi'
import React, { ReactNode } from 'react'
import { Picker, Text, View } from 'react-native'
import { ProposalsFetcher } from '../../fetchers/proposals-fetcher'
import { compareProposals, Proposal } from '../../libraries/favorite-proposal'
import { FavoritesStorage } from '../../libraries/favorites-storage'
import styles from '../proposals-styles'
import ButtonFavorite from './button-favorite'

export type ProposalsState = {
  SelectedProviderId?: string,
  Proposals?: ProposalDTO[]
}

type ProposalsProps = {
  favoritesStore: FavoritesStorage,
  proposalsFetcher: ProposalsFetcher,
  proposalsState: ProposalsState
}

@observer
export default class ProposalsDropdown extends React.Component<ProposalsProps> {
  private static renderProposal (p: Proposal) {
    const label = (p.isFavorite ? '* ' : '') + p.name

    return <Picker.Item key={p.providerID} label={label} value={p.providerID}/>
  }

  public render (): ReactNode {
    this.setDefaultSelectedProvider()
    const proposals = this.props.proposalsState.Proposals
    const selectedProviderId = this.props.proposalsState.SelectedProviderId
    if (!proposals) {
      return (
        <View style={styles.root}>
          <Text>Loading proposals...</Text>
        </View>
      )
    }

    return (
      <View style={styles.root}>
        <Picker
          style={styles.picker}
          selectedValue={selectedProviderId}
          onValueChange={(providerId: string) => this.onProposalSelected(providerId)}
        >
          {this.proposalsSorted.map(ProposalsDropdown.renderProposal)}
        </Picker>
        {selectedProviderId ? (
          <ButtonFavorite
            isFavorite={this.isFavoriteSelected}
            onPress={() => this.toggleFavorite(selectedProviderId)}
          />
        ) : null}
      </View>
    )
  }

  @computed
  private get proposalsSorted (): Proposal[] {
    if (this.props.proposalsState.Proposals === undefined) return []
    return this.props.proposalsState.Proposals
      .map((p: ProposalDTO) => new Proposal(p, this.props.favoritesStore.has(p.providerId)))
      .sort(compareProposals)
  }

  private get isFavoriteSelected (): boolean {
    if (!this.props.proposalsState.SelectedProviderId) return false
    return this.props.favoritesStore.has(this.props.proposalsState.SelectedProviderId)
  }

  @action
  private setDefaultSelectedProvider () {
    const stateProposals = this.props.proposalsState.Proposals
    const selectedProviderId = this.props.proposalsState.SelectedProviderId
    const stateProposalsIncludeSelectedProposal = stateProposals
      && stateProposals.some((p) => p.providerId === selectedProviderId)

    if (stateProposals && stateProposals[0]) {
      if (!selectedProviderId || !stateProposalsIncludeSelectedProposal) {
        this.props.proposalsState.SelectedProviderId = this.proposalsSorted[0].providerID
      }
    }
  }

  @action
  private async toggleFavorite (selectedProviderId: string): Promise<void> {
    const store = this.props.favoritesStore
    if (!store.has(selectedProviderId)) {
      await store.add(selectedProviderId)
    } else {
      await store.remove(selectedProviderId)
    }
  }

  @action
  private onProposalSelected (providerId: string) {
    this.props.proposalsState.SelectedProviderId = providerId
  }
}
