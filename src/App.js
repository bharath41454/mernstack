import React, { useCallback, useState } from "react";
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
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path='/' component={Users} exact />
        <Route path='/places/new' component={NewPlace} exact />
        <Route path='/places/:placeId' component={UpdatePlace} />
        <Route path='/:userId/places' component={UserPlaces} exact />
        {/* <Redirect to='/pagenotfound' component={() => "page not found"} /> */}
        <Redirect to='/' component={Users} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' component={Users} exact />
        <Route path='/:userId/places' component={UserPlaces} exact />
        <Route path='/auth' component={Auth} exact />
        <Redirect to='/auth' component={Auth} />
      </Switch>
    );
  }
  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </React.Fragment>
  );
};

export default App;
