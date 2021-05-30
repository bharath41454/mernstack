import React from "react";
import { useParams } from "react-router";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire",
    description: "lorem ipsum dolor sit amet",
    imageUrl:
      "https://www.technobuffalo.com/sites/technobuffalo.com/files/styles/large/public/wp/2016/10/google-pixel-sample-photos-edited-054.jpg",
    address: "lorem ipsum",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire",
    description: "lorem ipsum dolor sit amet",
    address: "lorem ipsum",
    imageUrl:
      "https://www.technobuffalo.com/sites/technobuffalo.com/files/styles/large/public/wp/2016/10/google-pixel-sample-photos-edited-054.jpg",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
