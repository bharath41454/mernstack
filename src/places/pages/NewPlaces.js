import React, { useCallback, useReducer } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";

const initialState = {
  inputs: {
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
  },
};
const NewPlace = () => {
  const [formState, InputHandler] = useForm(initialState, false);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); //TODO:Submit to backend
  };

  return (
    <React.Fragment>
      <form className='place-form' onSubmit={placeSubmitHandler}>
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter valid title'
          onInput={InputHandler}
        />
        <Input
          id='description'
          element='textareat'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter valid description (at least 5 characters).'
          onInput={InputHandler}
        />
        <Input
          id='address'
          element='input'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter valid address.'
          onInput={InputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
