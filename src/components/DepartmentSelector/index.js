import React, { useState } from "react";
import Select, { OptionTypeBase, OptionsType } from "react-select";
import { Container, Row, Col, Button } from "reactstrap";
const DepartmentSelector = ({
  value,
  onChange,
  departments,
  rowHeight,
  menuPortalTarget,
}) => {
  const currentDepartments = departments.map((d) => {
    return { label: d, value: d };
  });
  const [selectedDepartment, setSelectedDepartment] = useState(value);
  return (
    <Container className="p-0">
      <Row className="my-3 mx-0">
        <Col sm={12}>
          <div className="d-inline-flex float-left align-items-center">
            <span className="float-left mr-3">Department</span>
            <div className="float-left w-250px">
              <Select
                autoFocus
                value={currentDepartments.find(
                  (o) => o.value === selectedDepartment
                )}
                onChange={(d) => setSelectedDepartment(d.value)}
                options={currentDepartments}
              />
            </div>
            <Button
              className="float-left ml-3"
              style={{ width: "100px" }}
              color="primary"
              onClick={() => onChange(selectedDepartment)}
            >
              Apply
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentSelector;
