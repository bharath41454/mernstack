import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
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
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    auth.login();
  };
  return (
    <React.Fragment>
      <Card className='authentication'>
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name'
              onInput={InputHandler}
            />
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
