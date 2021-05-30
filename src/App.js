import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import "./App.css";
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path='/' component={Users} exact />
            <Route path='/places/new' component={NewPlace} exact />
            <Route path='/places/:placeId' component={UpdatePlace} />
            <Route path='/:userId/places' component={UserPlaces} exact />
            <Redirect to='/pagenotfound' component={() => "page not found"} />
          </Switch>
        </main>
      </Router>
    </React.Fragment>
  );
};

export default App;
