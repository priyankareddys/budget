import React, { useReducer, useState } from "react";
import DataGrid, { TextEditor, Row as GridRow } from "react-data-grid";
import _ from "lodash";
import faker from "faker";
import ConfirmPopup from "../components/ConfirmPopup";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CellExpanderFormatter } from "../helpers/CellExpanderFormatter";
import { SelectEditor } from "../helpers/SelectEditor";
import NumberEditor from "../helpers/numberEditor";
import { Container } from "reactstrap";
import DepartmentSelector from "../components/DepartmentSelector";
import {
  generateDepartmentData,
  calculateDataTotals,
  calculateChildrenTotal,
  getDepartments,
} from "../helpers/dataHelper";
import "./Home.scss";

const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "usd",
});

const defaultRows = [
  {
    id: 0,
    title: "Net Sales",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
  {
    id: 5,
    title: "Revenue",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
  {
    id: 6,
    title: "Funds",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
  {
    id: 7,
    title: "Charity",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
  {
    id: 8,
    title: "Charity",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
  {
    id: 9,
    title: "Charity",
    2020: faker.random.float(),
    2021: faker.random.float(),
    2022: faker.random.float(),
    2023: faker.random.float(),
    2024: faker.random.float(),
  },
];

function toggleSubRow(state, id) {
  const { rows, ...rest } = state;
  const rowIndex = rows.findIndex((r) => r.id === id);
  const row = rows[rowIndex];
  const children = [...row.children];
  if (!children) {
    children = [];
  }

  children.push({
    emptyRow: true,
    childLevel: 1,
    parentId: row.id,
    id: `${row.id}-addItem`,
  });

  const newRows = [...rows];
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (!row.isExpanded) {
    newRows.splice(rowIndex + 1, 0, ...children);
  } else {
    newRows.splice(rowIndex + 1, children.length);
  }
  return { rows: newRows, ...rest };
}

function deleteSubRow(state, id) {
  const { rows, ...rest } = state;
  const row = rows.find((r) => r.id === id);
  if (!row || !row.parentId) return rows;

  // Remove sub row from flattened rows.
  const newRows = rows.filter((r) => r.id !== id);

  // Remove sub row from parent row.
  const parentRowIndex = newRows.findIndex((r) => r.id === row.parentId);
  const { children } = newRows[parentRowIndex];
  if (children) {
    const newChildren = children.filter((sr) => sr.id !== id);
    newRows[parentRowIndex] = {
      ...newRows[parentRowIndex],
      children: newChildren,
    };
  }

  return { rows: newRows, ...rest };
}

function insertSubRow(state, data) {
  const rows = [...state.rows];
  if (!data.parentId) {
    return state;
  }
  const newRow = _.extend(
    {
      id: uuidv4(),
      childLevel: 1,
    },
    { ...data }
  );

  const parentRowIndex = rows.findIndex((r) => r.id === data.parentId);
  const parentRow = { ...rows[parentRowIndex] };
  let parentChildren = [...parentRow.children];
  parentChildren.push({ ...newRow });
  parentRow.children = parentChildren;
  const childrenLength = parentChildren.length;
  rows[parentRowIndex] = parentRow;
  rows.splice(parentRowIndex + childrenLength, 0, newRow);
  return { ...state, rows };
}

function updateRow(state, data) {
  const rows = [...state.rows];
  if (!data.parentId) {
    return state;
  }

  const parentRowIndex = rows.findIndex((r) => r.id === data.parentId);
  let parentRow = { ...rows[parentRowIndex] };
  let parentChildren = [...parentRow.children];

  const childRowIndex = parentChildren.findIndex((c) => c.id === data.id);
  parentChildren[childRowIndex] = data;
  parentRow.children = parentChildren;
  parentRow = calculateChildrenTotal(parentRow);
  rows[parentRowIndex] = parentRow;

  const viewRowIndex = rows.findIndex((r) => r.id === data.id);
  const viewRow = { ...rows[viewRowIndex] };
  rows[viewRowIndex] = data;
  return { ...state, rows };
}

function updateData(state, department) {
  let rows = [...state.rows];
  let data = [...state.data];
  let currentDepartment = state.currentDepartment;
  if (currentDepartment === department) {
    return state;
  }
  const deptIndex = data.findIndex((d) => d.department === department);
  const curDeptIndex = data.findIndex(
    (d) => d.department === currentDepartment
  );
  data[curDeptIndex].data = [...rows];
  rows = [...data[deptIndex].data];
  return { rows, data, currentDepartment: department };
}

function reducer(state, action) {
  switch (action.type) {
    case "toggleSubRow":
      return toggleSubRow(state, action.id);
    case "deleteSubRow":
      return deleteSubRow(state, action.id);
    case "insertSubRow":
      return insertSubRow(state, action.data);
    case "updateRow":
      return updateRow(state, action.data);
    case "updateData":
      return updateData(state, action.department);
    default:
      return state;
  }
}

function Home() {
  const data = generateDepartmentData();
  const departments = getDepartments();
  const [state, dispatch] = useReducer(reducer, {
    rows: data[0].data,
    data: data,
    currentDepartment: data[0].department,
  });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteRowValue, setDeleteRowValue] = useState({});

  function addSubRow(parentId) {
    const newRow = {
      title: "",
      childLevel: 1,
      parentId: parentId,
    };
    dispatch({ type: "insertSubRow", data: newRow });
  }

  function onRowTitleChange(value) {
    const selectedValue = defaultRows.find((r) => r.id === value.title);
    const updatedRow = _.extend(
      { ...value },
      _.omit({ ...selectedValue }, "id")
    );
    dispatch({ type: "updateRow", data: updatedRow });
  }

  function onRowChange(value) {
    dispatch({ type: "updateRow", data: value });
  }

  const columns = [
    {
      key: "title",
      name: "Budget",
      width: 240,
      frozen: true,
      formatter({ row, isCellSelected, ...rest }) {
        const hasChildren = row.children && row.children.length > 0;
        return (
          <>
            {hasChildren && (
              <>
                <CellExpanderFormatter
                  isCellSelected={isCellSelected}
                  expanded={row.isExpanded === true}
                  onCellExpand={() =>
                    dispatch({ id: row.id, type: "toggleSubRow" })
                  }
                />
              </>
            )}
            <div
              class="row-pad"
              style={{
                textAlign: "left",
                marginLeft: row.childLevel * 26,
              }}
            >
              {row.childLevel > 0 && !row.emptyRow && (
                <span
                  className="ml-2"
                  onClick={(event) => handleDeleteItem(event, row)}
                >
                  <span className="trash text-danger float-left">
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </span>
              )}
              {row.emptyRow ? (
                <span
                  onClick={() => addSubRow(row.parentId)}
                  className="addItem"
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Add Item
                </span>
              ) : (
                <>{row.title ? row.title : <span>Select ...</span>}</>
              )}
            </div>
          </>
        );
      },
      editable: true,
      editorOptions: {
        editOnClick: true,
      },
      editor: (p) =>
        p.row.childLevel > 0 &&
        !p.row.emptyRow && (
          <SelectEditor
            value={p.row.title}
            onChange={(value) => onRowTitleChange({ ...p.row, title: value })}
            options={defaultRows.map((c) => ({ value: c.id, label: c.title }))}
            rowHeight={p.rowHeight}
            menuPortalTarget={p.editorPortalTarget}
          />
        ),
    },
    {
      key: "2020",
      name: "FY 2020",
      width: 150,
      formatter: (props) => {
        const value = props.row["2020"];
        return (
          <div
            class="row-pad"
            style={{ textAlign: "right", backgroundColor: "#f5f5f5" }}
          >
            {value ? currencyFormatter.format(value) : ""}
          </div>
        );
      },
    },
    {
      key: "2021",
      name: "FY 2021",
      width: 150,
      formatter: (props) => {
        const value = props.row["2021"];
        return (
          <div
            class="row-pad"
            style={{ textAlign: "right", backgroundColor: "#f5f5f5" }}
          >
            {value ? currencyFormatter.format(value) : ""}
          </div>
        );
      },
    },
    {
      key: "2022",
      name: "FY 2022",
      width: 150,
      editorOptions: {
        editOnClick: true,
      },
      editor: (p) => (
        <NumberEditor
          disabled={p.row["emptyRow"] || p.row["childLevel"] === 0}
          value={p.row["2022"]}
          onChange={(value) => onRowChange({ ...p.row, 2022: value })}
        />
      ),
      formatter: (props) => {
        const value = props.row["2022"];
        return (
          <div
            class="row-pad"
            style={{
              textAlign: "right",
              backgroundColor:
                props.row["childLevel"] === 0 ? "#f5f5f5" : "white",
            }}
          >
            {value ? currencyFormatter.format(value) : ""}
          </div>
        );
      },
    },
    {
      key: "2023",
      name: "FY 2023",
      width: 150,
      formatter: (props) => {
        const value = props.row["2023"];
        return (
          <div
            class="row-pad"
            style={{
              textAlign: "right",
              backgroundColor:
                props.row["childLevel"] === 0 ? "#f5f5f5" : "white",
            }}
          >
            {_.isNumber(value) ? currencyFormatter.format(value) : ""}
          </div>
        );
      },
      editorOptions: {
        editOnClick: true,
      },
      editor: (p) => (
        <NumberEditor
          disabled={p.row["emptyRow"] || p.row["childLevel"] === 0}
          value={p.row["2023"]}
          onChange={(value) => onRowChange({ ...p.row, 2023: value })}
        />
      ),
    },
    {
      key: "2024",
      name: "FY 2024",
      width: 150,
      formatter: (props) => {
        const value = props.row["2024"];
        return (
          <div
            class="row-pad"
            style={{
              textAlign: "right",
              backgroundColor:
                props.row["childLevel"] === 0 ? "#f5f5f5" : "white",
            }}
          >
            {value ? currencyFormatter.format(value) : ""}
          </div>
        );
      },
      editorOptions: {
        editOnClick: true,
      },
      editor: (p) => (
        <NumberEditor
          disabled={p.row["emptyRow"] || p.row["childLevel"] === 0}
          value={p.row["2024"]}
          onChange={(value) => onRowChange({ ...p.row, 2024: value })}
        />
      ),
    },
  ];

  function handleDeleteItem(event, row) {
    event.stopPropagation();
    setShowDeletePopup(true);
    setDeleteRowValue(row);
  }

  function onDeleteConfirm(row) {
    dispatch({ id: row.id, type: "deleteSubRow" });
    setShowDeletePopup(false);
  }

  function changeDepartment(department) {
    console.log("will dispatch");
    dispatch({ type: "updateData", department: department });
  }

  return (
    <Container className="mx-auto p-2 w-100">
      <DepartmentSelector
        className="departmentSelector"
        value={state.currentDepartment}
        departments={departments}
        onChange={(v) => changeDepartment(v)}
      ></DepartmentSelector>
      <DataGrid
        rowKeyGetter={(row) => row.id}
        rows={state.rows}
        columns={columns}
        style={{ height: "100vh" }}
        className="fill-grid"
      />
      <ConfirmPopup
        title="Delete"
        isOpen={showDeletePopup}
        toggle={() => setShowDeletePopup(false)}
        message="Are you sure you want to delete this item"
        closeButtonText="CANCEL"
        onClose={() => setShowDeletePopup(false)}
        confirmButtonText="CONFIRM"
        confirmButtonColor="danger"
        onConfirm={() => onDeleteConfirm(deleteRowValue)}
      />
    </Container>
  );
}

export default Home;
