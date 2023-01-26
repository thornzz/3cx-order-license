import React from "react";
import Select from "react-select";
import { forwardRef } from "react";

const CustomSelect = forwardRef((props, ref) => {
  const { value, onChange, options, label, error, onBlur, name, touched } =
    props;
  return (
    <>
      <Select
        isClearable="true"
        value={value}
        ref={ref}
        options={options}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        noOptionsMessage={() => "Uygun kayıt bulunamadı!"}
        placeholder="Bayi seçimi yapınız..."
      />
    </>
  );
});

export default CustomSelect;

