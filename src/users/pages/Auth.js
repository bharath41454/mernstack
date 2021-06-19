import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const initialState = {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  };

  const [formState, InputHandler, setFormData] = useForm(initialState, false);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.user.id);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log(formState.inputs);
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.user.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <React.Fragment>
              <Input
                element='input'
                id='name'
                type='text'
                label='Your Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a name'
                onInput={InputHandler}
              />
              <ImageUpload
                id='image'
                center
                onInput={InputHandler}
                errorText='Please provide an image'
              />
            </React.Fragment>
          )}
          <Input
            id='email'
            element='input'
            type='email'
            label='E-mail'
            placeholder='enter email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter valid email'
            onInput={InputHandler}
          />
          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            placeholder='enter password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter valid password'
            onInput={InputHandler}
          />
          <Button type='submit' inverse disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "SIGNUP"}
          </Button>
        </form>
        <Button type='submit' inverse onClick={switchModeHandler}>
          {!isLoginMode ? "Switch to Login" : "Switch to sign up"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
