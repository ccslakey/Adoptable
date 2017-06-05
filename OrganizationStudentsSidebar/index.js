import _ from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';

import OrganizationUser from '../../containers/OrganizationUser';
import CreateSectionWidget from '../../components/CreateSectionWidget';
import CreateStudentWidget from '../../components/CreateStudentWidget';
import UserSearchBar from '../../components/UserSearchBar';

import {
  C_BACKGROUND_PRIMARY,
  C_BORDER_PRIMARY,
  C_SECONDARY,
  SIDEBAR_WIDTH_PX,
  SPACER_SIZE_PX,
} from '../../library/constants';
import {
  FlexWrapper,
  Icon,
  Spacer,
  Text,
} from '../../library';

const Sidebar = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: ${SIDEBAR_WIDTH_PX};
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid ${C_BORDER_PRIMARY};
  z-index: 10;
`;

const SectionText = styled(Text)`
  padding: ${SPACER_SIZE_PX};
  color: ${C_SECONDARY};
  &:hover {
    cursor: pointer;
    background-color: ${C_BACKGROUND_PRIMARY};
  }
`;

const CurrentSectionDiv = styled(FlexWrapper)`
  padding: ${SPACER_SIZE_PX};
  &:hover {
    cursor: pointer;
    background-color: ${C_BACKGROUND_PRIMARY};
  }
`;

const Sections = styled.div`
  border-top: 2px solid ${C_BORDER_PRIMARY};
`;

class OrganizationStudentsSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSectionId: props.activeSectionId,
      searchSections: [],
      searchTerm: '',
      hasSearch: false,
      text: '',
      isExpanded: false,
      currentSection: this.props.sections.slice(0, 1)[0],
    };

    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleSectionExpand = this.handleSectionExpand.bind(this);
    this.handleUserExpand = this.handleUserExpand.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.reset = this.reset.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
  }
  componentWillReceiveProps(props) {
    if (!this.state.activeSectionId) {
      this.setState({
        activeSectionId: props.activeSectionId,
      });
    }
  }
  onSearchInput = (event) => {
    let term = event.target.value;
    this.setState({
      searchTerm: term,
      activeSectionId: null,
      text: 'X',
    });
    term = term.toLowerCase();
    if (term === '') {
      this.setState({ hasSearch: false, text: '' });
      return;
    }
    const userEdges = _.flatten(_.map(this.props.sections, (sectionEdge) => sectionEdge.node.users.edges));
    const users = _.map(userEdges, 'node');

    const searchUsers = _.filter(users, (user) => (
      _.includes((user.full_name || '').toLowerCase(), term) ||
      _.includes((user.email || '').toLowerCase(), term) ||
      _.includes((user.name || '').toLowerCase(), term)
    ));

    this.setState({
      searchUsers,
      hasSearch: true,
    });
  }

  handleSectionExpand = (id) => {
    if (id === this.state.activeSectionId) {
      this.setState({ activeSectionId: null });
    } else {
      this.setState({ activeSectionId: id });
    }
  }

  handleSectionChange = (section) => {
    this.setState({ currentSection: section, isExpanded: !(this.state.isExpanded) });
  }

  handleUserExpand = () => {
    this.setState({ isExpanded: !(this.state.isExpanded) });
  }

  reset = () => {
    this.setState({
      searchTerm: '',
      searchUsers: [],
      text: '',
      hasSearch: false,
    });
  }

  renderIcon() {
    if (this.props.sections.length === 1) {
      return null;
    }
    const { isExpanded } = this.state;

    if (isExpanded) {
      return (
        <Icon name="angle-up" size="2x" />
      );
    }

    return (
      <Icon name="angle-down" size="2x" />
    );
  }

  renderUsers() {
    const users = this.state.searchUsers;

    return (
      _.map(users, (user) => (
        <OrganizationUser key={user.id} user={user} organization={this.props.organization} />
      ))
    );
  }

  renderSections() {
    const { sections } = this.props;
    const { currentSection } = this.state;

    if (!currentSection) {
      return (
        <CreateSectionWidget organization={this.props.organization} />
      );
    }

    const userEdges = currentSection.node.users.edges;
    const otherSections = _.without(sections, currentSection);

    const expandedContent = (
      <Sections>
        <Spacer height="1" />
        {_.map(otherSections, (section) => {
          const sec = section.node;
          return (
            <div key={sec.id} onClick={() => this.handleSectionChange(section)}>
              <SectionText medium left onClick={() => this.handleSectionChange(section)}>{sec.name}</SectionText>
            </div>
          );
        })}
      </Sections>
    );

    const addSection = (
      <CreateSectionWidget organization={this.props.organization} />
    );

    const addStudent = currentSection ? (
      <CreateStudentWidget section={currentSection.node} organization={this.props.organization} />
    ) : null;

    const choosingSections = this.state.isExpanded ? expandedContent : null;

    const addContent = this.state.isExpanded ? addSection : addStudent;

    return (
      <div>
        <FlexWrapper column>
          <CurrentSectionDiv column onClick={this.handleUserExpand}>
            <Spacer height="1" />
            <Text left small light>CLASSES ({this.props.sections.length})</Text>
            <FlexWrapper row align-center justify-between>
              <Text large>{currentSection.node.name}</Text>
              { this.renderIcon() }
            </FlexWrapper>
          </CurrentSectionDiv>
          { choosingSections }
          {_.map(userEdges, (edge) => {
            const user = edge.node;
            if (this.state.isExpanded) {
              return null;
            }
            return (
              <OrganizationUser key={user.id} user={user} organization={this.props.organization} />
            );
          })}
          <Spacer height="2" />
          { addContent }
        </FlexWrapper>
      </div>
    );
  }

  render() {
    const contentEl = this.state.hasSearch ? this.renderUsers() : this.renderSections();

    return (
      <Sidebar>
        <FlexWrapper column>
          <UserSearchBar onSearchInput={this.onSearchInput} searchTerm={this.state.searchTerm} text={this.state.text} reset={this.reset} />
          { contentEl }
        </FlexWrapper>
      </Sidebar>
    );
  }
}

export default OrganizationStudentsSidebar;
