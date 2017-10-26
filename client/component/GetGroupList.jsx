import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Group from './Groups';
import { getGroups } from '../actions/GroupAction';

class GetGroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Groups: this.props.Groups,
    };
  }
  componentDidMount() {
    this.props.getGroups();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      Groups: nextProps.Groups,
    });
  }

  render() {
    const { Groups } = this.state;
    const groupArray = Groups.map((group, groupid) => (
      <div key={groupid} className="groupdisplay">
        <Group key={groupid} group={group} />
      </div>
    ));
    return <div>{groupArray}</div>;
  }
}
GetGroupList.PropTypes = {
  Groups: PropTypes.array.isRequired,
};
function mapStateToProps(state) {
  return {
    Groups: state.Groups,
  };
}
export default withRouter(connect(mapStateToProps, { getGroups })(GetGroupList));
