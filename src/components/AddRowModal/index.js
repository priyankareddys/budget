import React, { Component } from "react";
import faker from "faker";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { SelectEditor } from "../../helpers/SelectEditor";
import _ from "lodash";

class AddRowModal extends Component {
  dataFields = [
    { title: "2019", key: "2019", disabled: true },
    { title: "2020", key: "2020", disabled: true },
    { title: "2021", key: "2021", disabled: false },
    { title: "2022", key: "2022", disabled: false },
    { title: "2023", key: "2023", disabled: false },
    { title: "2024", key: "2024", disabled: false },
    { title: "2025", key: "2025", disabled: false },
    { title: "2026", key: "2026", disabled: false },
    { title: "2027", key: "2027", disabled: false },
    { title: "2028", key: "2028", disabled: false },
  ];
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      defaultRows: this.props.data.defaultRows,
      newRow: {
        id: faker.random.number(),
        title: "",
        childLevel: this.props.level || 0,
        isExpanded: false,
        children: [],
      },
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.isOpen && prevProps !== this.props) {
      console.log("CDUP", this.props.data);
      this.setState({
        data: this.props.data,
        defaultRows: this.props.data.defaultRows,
      });
    }
  };

  handleTitleChange = (value) => {
    console.log(value);
    const defaultData = _.find(
      this.state.defaultRows,
      (row) => row.id === value
    );
    console.log(defaultData);
    this.setState({
      newRow: defaultData,
    });
    // console.log(this.state.newRow);
  };

  handleChange = (value, key) => {
    console.log(value, key);
    let updatedData = { ...this.state.newRow };
    updatedData[key] = value;
    this.setState({ newRow: updatedData });
  };

  closeModal = () => {
    this.setState({});
    this.props.toggle();
  };

  addRow = () => {
    const data = { ...this.state.newRow };
    this.props.onAddRow(
      this.props.data.parentIndex,
      this.props.data.childIndex,
      data
    );
    this.closeModal();
  };

  render() {
    return (
      <Modal
        size="lg"
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className={this.props.className}
      >
        <ModalHeader>
          Add Parent Row {this.state.data.parentIndex}{" "}
          {this.state.data?.childIndex}
        </ModalHeader>
        {this.state.data.defaultRows && (
          <ModalBody style={{ height: "70vh", overflowY: "auto" }}>
            <Form>
              <FormGroup>
                <Label for="newRowTitle">Title</Label>
                <SelectEditor
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                  options={this.state.defaultRows.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                />
              </FormGroup>
              {this.dataFields.map((dataField) => {
                return (
                  <FormGroup key={dataField.key}>
                    <Label for={dataField.key}>{dataField.title}</Label>
                    <Input
                      type="number"
                      value={this.state.newRow[dataField.key]}
                      disabled={dataField.disabled}
                      onChange={(event) =>
                        this.handleChange(
                          parseFloat(event.target.value),
                          dataField.key
                        )
                      }
                    />
                  </FormGroup>
                );
              })}
            </Form>
          </ModalBody>
        )}

        <ModalFooter>
          <Button color="primary" onClick={this.addRow}>
            Add
          </Button>{" "}
          <Button color="secondary" onClick={this.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddRowModal;
