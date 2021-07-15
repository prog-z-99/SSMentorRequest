import { Form } from "formik";
import Select from "react-select";
import styled from "styled-components";

export const PageWrappaer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
`;

export const FormWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  max-width: 900px;
`;

export const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 2em;
  width: 100%;
`;

const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FieldTitle = styled.h4``;

const ErrorText = styled.span`
  color: #f44336;
  margin: 0;
  font-size: 0.75rem;
  margin-top: 3px;
  text-align: left;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  line-height: 1.66;
  letter-spacing: 0.03333em;
`;

const FieldInput = styled.input`
  height: 2em;
`;

export const TableSelect = styled(Select)`
  &.Problem {
    color: red;
  }
  &.Not-Accepted {
    color: yellow;
  }
  &.Completed {
    background-color: green;
  }
  &.In-Progress {
    background-color: lightblue;
  }
`;

export const FormSelect: React.FC<any> = ({
  title,
  name,
  options,
  onChange,
  error,
}) => {
  return (
    <FieldWrapper>
      <FieldTitle>{title}</FieldTitle>
      <Select
        options={formatter(options)}
        onChange={(e) => onChange(e, name)}
      />
      <ErrorText>{error}</ErrorText>
    </FieldWrapper>
  );
};

export const FormTextField: React.FC<any> = ({
  title,
  errorText,
  ...props
}) => {
  return (
    <FieldWrapper>
      <FieldTitle>{title}</FieldTitle>
      <FieldInput type="text" {...props} />
      <ErrorText>{errorText}</ErrorText>
    </FieldWrapper>
  );
};

export const formatter = (list) => {
  return list.map((item) => {
    return { value: item, label: item };
  });
};
