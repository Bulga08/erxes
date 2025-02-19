import { ChooseBox, FlexContainer } from '@erxes/ui-engage/src/styles';
import PercentItem, { ItemWrapper } from './PercentItem';

import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { EMPTY_CONTENT_ENGAGE } from '@erxes/ui-settings/src/constants';
import EmptyContent from '@erxes/ui/src/components/empty/EmptyContent';
import FormControl from '@erxes/ui/src/components/form/Control';
import { IEngageMessage } from '@erxes/ui-engage/src/types';
import { Link } from 'react-router-dom';
import MessageListRow from '../containers/MessageListRow';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import React from 'react';
import Sidebar from '../containers/Sidebar';
import { TAG_TYPES } from '@erxes/ui-tags/src/constants';
import Table from '@erxes/ui/src/components/table';
import TaggerPopover from '@erxes/ui-tags/src/components/TaggerPopover';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import colors from '@erxes/ui/src/styles/colors';
import { isEnabled } from '@erxes/ui/src/utils/core';

type Props = {
  messages: IEngageMessage[];
  totalCount: number;
  bulk: any[];
  isAllSelected: boolean;
  emptyBulk: () => void;
  toggleBulk: (target: IEngageMessage, toAdd: boolean) => void;
  toggleAll: (targets: IEngageMessage[], name: string) => void;
  loading: boolean;
  queryParams: any;
  emailPercentages: any;
  refetch: () => void;
};

class List extends React.Component<Props> {
  onChange = () => {
    const { toggleAll, messages } = this.props;

    toggleAll(messages, 'engageMessages');
  };

  renderTagger() {
    const { bulk, emptyBulk } = this.props;

    const tagButton = (
      <Button btnStyle="simple" size="small" icon="tag-alt">
        {__('Tag')}
      </Button>
    );

    if (!bulk.length) {
      return null;
    }

    return (
      <TaggerPopover
        type={TAG_TYPES.ENGAGE_MESSAGE}
        targets={bulk}
        trigger={tagButton}
        successCallback={emptyBulk}
      />
    );
  }

  renderBox(title, desc, url) {
    return (
      <ChooseBox>
        <Link to={url}>
          <b>{__(title)}</b>
          <p>{__(desc)}</p>
        </Link>
      </ChooseBox>
    );
  }

  renderPercentage() {
    const { emailPercentages } = this.props;

    if (!emailPercentages) {
      return <>You haven't sent email campaigns yet.</>;
    }

    const trigger = (
      <Button btnStyle="warning" size="small" icon="analysis">
        {__('Email statistics')}
      </Button>
    );

    const {
      avgBouncePercent,
      avgComplaintPercent,
      avgDeliveryPercent,
      avgOpenPercent,
      avgClickPercent,
      avgRenderingFailurePercent,
      avgRejectPercent,
      avgSendPercent
    } = emailPercentages;

    const content = () => (
      <React.Fragment>
        <h5>Average email statistics:</h5>
        <ItemWrapper>
          <PercentItem
            color={colors.colorCoreBlue}
            icon="telegram-alt"
            name="Sent"
            percent={avgSendPercent}
          />
          <PercentItem
            color={colors.colorCoreGreen}
            icon="comment-check"
            name="Delivered"
            percent={avgDeliveryPercent}
          />
          <PercentItem
            color={colors.colorCoreOrange}
            icon="envelope-open"
            name="Opened"
            percent={avgOpenPercent}
          />
          <PercentItem
            color={colors.colorCoreDarkBlue}
            icon="mouse-alt"
            name="Clicked"
            percent={avgClickPercent}
          />
          <PercentItem
            color={colors.colorCoreTeal}
            icon="frown"
            name="Complaint"
            percent={avgComplaintPercent}
          />
          <PercentItem
            color={colors.colorCoreYellow}
            icon="arrows-up-right"
            name="Bounce"
            percent={avgBouncePercent}
          />
          <PercentItem
            color={colors.colorCoreRed}
            icon="ban"
            name="Rejected"
            percent={avgRejectPercent}
          />
          <PercentItem
            color={colors.colorCoreDarkGray}
            icon="times-circle"
            name="Rendering failure"
            percent={avgRenderingFailurePercent}
          />
        </ItemWrapper>
      </React.Fragment>
    );

    return (
      <ModalTrigger
        title="New message"
        trigger={trigger}
        content={content}
        hideHeader={true}
        enforceFocus={false}
        centered={true}
      />
    );
  }

  renderRightActionBar = () => {
    const trigger = (
      <Button btnStyle="success" size="small" icon="plus-circle">
        {__('New campaign')}
      </Button>
    );

    const content = () => (
      <FlexContainer direction="column">
        {this.renderBox(
          'Auto campaign',
          'Auto message description',
          '/campaigns/create?kind=auto'
        )}
        {this.renderBox(
          'Manual campaign',
          'Manual message description',
          '/campaigns/create?kind=manual'
        )}
        {this.renderBox(
          'Visitor auto campaign',
          'Visitor auto message description',
          '/campaigns/create?kind=visitorAuto'
        )}
      </FlexContainer>
    );

    return (
      <>
        {this.renderPercentage()}
        <ModalTrigger
          title="New campaign"
          trigger={trigger}
          content={content}
          hideHeader={true}
          enforceFocus={false}
          centered={true}
        />
      </>
    );
  };

  render() {
    const {
      messages,
      totalCount,
      bulk,
      toggleBulk,
      loading,
      queryParams,
      isAllSelected,
      refetch
    } = this.props;

    const actionBar = (
      <Wrapper.ActionBar
        withMargin
        wide
        background="colorWhite"
        left={isEnabled('tags') && this.renderTagger()}
        right={this.renderRightActionBar()}
      />
    );

    const mainContent = (
      <Table whiteSpace="nowrap" hover={true} bordered={true}>
        <thead>
          <tr>
            <th style={{ width: 60 }}>
              <FormControl
                checked={isAllSelected}
                componentClass="checkbox"
                onChange={this.onChange}
              />
            </th>
            <th>{__('Title')}</th>
            <th>{__('Status')}</th>
            <th>{__('Total')}</th>
            <th>{__('Type')}</th>
            <th>{__('Brand')}</th>
            <th>{__('From')}</th>
            <th>{__('Created by')}</th>
            <th>{__('Created date')}</th>
            <th>{__('Scheduled date')}</th>
            {isEnabled('tags') && <th>{__('Tags')}</th>}
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="engageMessages">
          {messages.map(message => (
            <MessageListRow
              isChecked={bulk.includes(message)}
              toggleBulk={toggleBulk}
              key={message._id}
              message={message}
              queryParams={queryParams}
              refetch={refetch}
            />
          ))}
        </tbody>
      </Table>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Campaigns')}
            breadcrumb={[{ title: __('Campaigns') }]}
            queryParams={queryParams}
          />
        }
        leftSidebar={<Sidebar queryParams={queryParams} />}
        actionBar={actionBar}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={messages.length}
            emptyContent={<EmptyContent content={EMPTY_CONTENT_ENGAGE} />}
          />
        }
        hasBorder
        noPadding
      />
    );
  }
}

export default List;
