import React from "react";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: 1,
      image:
        "https://www.technobuffalo.com/sites/technobuffalo.com/files/styles/large/public/wp/2016/10/google-pixel-sample-photos-edited-054.jpg",
      name: "B",
      places: 3,
    },
  ];
  return (
    <React.Fragment>
      <UserList items={USERS} />
    </React.Fragment>
  );
};

export default Users;
