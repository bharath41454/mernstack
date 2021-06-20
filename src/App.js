import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import "./App.css";
// import Users from "./users/pages/Users";
// import NewPlace from "./places/pages/NewPlaces";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const Users = React.lazy(() => import("./users/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlaces"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));

const App = () => {
  const { token, userId, login, logout } = useAuth();
  let routes;
  if (token) {
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
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNavigation />
          <main>
            <Suspense
              fallback={
                <div className='center'>
                  <LoadingSpinner />
                </div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </Router>
      </AuthContext.Provider>
    </React.Fragment>
  );
};

export default App;
