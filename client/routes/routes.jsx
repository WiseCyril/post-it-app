import React from 'react';
import { Route } from 'react-router-dom';
import App from '../component/App';
import HomePage from '../component/HomePage';
import Login from '../component/LogIn';
import SignUpPage from '../component/SignUpPage';
import DashBoard from '../component/DashBoard';
import AddGroup from '../component/AddGroup';
import PasswordReset from '../component/PasswordReset';
import GetGroupList from '../component/GetGroupList';
import MessageList from '../component/MessageList';
import GroupMessage from '../component/GroupMessage';
import UserRoute from '../component/UserRoute';

export default (
  <div>
    <Route path="/" component={App} />
    <Route exact path="/" component={HomePage} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/addgroup" component={AddGroup} />
    <Route exact path="/signup" component={SignUpPage} />
    <UserRoute exact path="/dashboard" component={DashBoard} />
    <Route exact path="/passwordreset" component={PasswordReset} />
    <Route exact path="/getgroup" component={GetGroupList} />
    <Route path="/group/:groupid" component={GroupMessage} />
    <Route exact path="/message/:groupid" component={MessageList} />
  </div>
);
