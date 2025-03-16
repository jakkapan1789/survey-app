import React, { createContext, useContext, useState, useEffect } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const storedResponses = JSON.parse(localStorage.getItem("responses")) || [];
    setForms(storedForms);
    setResponses(storedResponses);
  }, []);

  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem("responses", JSON.stringify(responses));
  }, [responses]);

  const createForm = () => {
    const newForm = {
      id: `form-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "แบบสอบถามใหม่",
      description: "คำอธิบายแบบสอบถาม",
      questions: [
        {
          id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: "text",
          title: "คำถามใหม่",
          required: false,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      published: false,
    };

    setForms((prevForms) => [...prevForms, newForm]);
    return newForm.id;
  };

  const updateForm = (form) => {
    setForms((prevForms) =>
      prevForms.map((f) => (f.id === form.id ? form : f))
    );
  };

  const deleteForm = (formId) => {
    setForms((prevForms) => prevForms.filter((f) => f.id !== formId));
  };

  const getForm = (formId) => {
    return forms.find((f) => f.id === formId);
  };

  const publishForm = (formId) => {
    setForms((prevForms) =>
      prevForms.map((f) => (f.id === formId ? { ...f, published: true } : f))
    );
  };

  const unpublishForm = (formId) => {
    setForms((prevForms) =>
      prevForms.map((f) => (f.id === formId ? { ...f, published: false } : f))
    );
  };

  const submitResponse = (formResponse) => {
    const newResponse = {
      id: `response-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      ...formResponse,
    };
    setResponses((prevResponses) => [...prevResponses, newResponse]);
  };

  const getFormResponses = (formId) => {
    return responses.filter((r) => r.formId === formId);
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        responses,
        createForm,
        updateForm,
        deleteForm,
        getForm,
        publishForm,
        unpublishForm,
        submitResponse,
        getFormResponses,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
