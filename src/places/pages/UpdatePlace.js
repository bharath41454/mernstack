import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const { userId, token } = useContext(AuthContext);
  const initialState = {
    title: {
      value: "",
      isValid: true,
    },
    description: {
      value: "",
      isValid: true,
    },
  };

  const [formState, InputHandler, setFormData] = useForm(initialState, true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.BACKEND_URL}places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaces();
  }, [setFormData, sendRequest, placeId]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.BACKEND_URL}places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
      history.push(`/${userId}/places`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title'
            onInput={InputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            type='text'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description'
            onInput={InputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            Update
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;