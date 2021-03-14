import React, { useReducer, useMemo, useState } from "react";
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
import "./Home.scss";

const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "usd",
});

function createData(count, level, data = {}) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    let rowData = _.extend(
      {
        ...data,
      },
      {
        id: uuidv4(),
        title: faker.finance.accountName(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        childLevel: level,
        isExpanded: false,
      }
    );
    rows.push(rowData);
  }
  return rows;
}

function createMultiLevelData() {
  const l1 = createData(5, 0);
  _.each(l1, (item0) => {
    const l2 = createData(2, 1, { parentId: item0.id });
    // _.each(l2, item1 => {
    //     const l3 = createData(2, 2)
    //     item1.children = l3
    // })
    item0.children = l2;
  });
  return l1;
}

function calculateChildrenTotal(item) {
  const fieldsForSum = ["2020", "2021", "2022", "2023", "2024", "2025"];
  _.each(fieldsForSum, (field) => {
    item[field] = _.sumBy(item.children, field);
  });
  return item;
}

function calculateIndividualTotals(data) {
  _.each(data, (item0) => {
    item0 = calculateChildrenTotal(item0);
  });
  return data;
}

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
  const { rows } = state;
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
  return { rows: newRows };
}

function deleteSubRow(state, id) {
  const { rows } = state;
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

  return { rows: newRows };
}

function insertSubRow(state, data) {
  const rows = [...state.rows];
  if (!data.parentId) {
    return;
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
  return { rows };
}

function updateRow(state, data) {
  const rows = [...state.rows];
  if (!data.parentId) {
    return { rows };
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
  return { rows };
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
    default:
      return state;
  }
}

function currencyView(props, key) {
  const value = props.row[key];
  return (
    <div style={{ textAlign: "right" }}>{currencyFormatter.format(value)}</div>
  );
}

function totalView(row, key) {
  return (
    <strong>
      <div className="row-pad" style={{ textAlign: "right" }}>
        {currencyFormatter.format(row[key])}
      </div>
    </strong>
  );
}

function Home() {
  const data = calculateIndividualTotals(createMultiLevelData());
  const [state, dispatch] = useReducer(reducer, { rows: data });
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
    console.log("updatedRow", updatedRow);
    console.log("title is changed");
    dispatch({ type: "updateRow", data: updatedRow });
  }

  function onRowChange(value) {
    console.log("row is changed", value);
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
              style={{ textAlign: "left", marginLeft: row.childLevel * 26 }}
            >
              {row.childLevel > 0 && !row.emptyRow && (
                <span className="ml-2" onClick={() => handleDeleteItem(row)}>
                  <span className="trash text-danger float-left">
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </span>
              )}
              {row.emptyRow ? (
                <span
                  onClick={() => addSubRow(row.parentId)}
                  className="addItem text-dark text-center"
                  style={{ marginLeft: row.childLevel * 26 }}
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
        p.row.childLevel > 0 && (
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
            style={{ textAlign: "right", backgroundColor: "#e9e9e9" }}
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
            style={{ textAlign: "right", backgroundColor: "#e9e9e9" }}
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
          <div class="row-pad" style={{ textAlign: "right" }}>
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
          <div class="row-pad" style={{ textAlign: "right" }}>
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
          <div class="row-pad" style={{ textAlign: "right" }}>
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

  function handleDeleteItem(row) {
    setShowDeletePopup(true);
    setDeleteRowValue(row);
  }

  // function onRowDelete(e, { rowIdx }) {
  //   // alert(`Will delete row at index ${rowIdx}`);
  //   dispatch({ type: "deleteRow", index: rowIdx });
  // }
  function onDeleteConfirm(row) {
    console.log("will delete confirm", row);
    dispatch({ id: row.id, type: "deleteSubRow" });
    setShowDeletePopup(false);
  }

  // function onRowInsertParent(e, { rowIdx }) {
  //   // console.log("INSERT PARENT", rowIdx);
  //   setAddRowConfig({ parentIndex: rowIdx, defaultRows: defaultRows });
  //   setShowAddRowModal(true);
  // }

  function onRowInsertChild(e, { rowIdx }) {
    alert(`Will create a child row at index ${rowIdx}`);
  }

  // const handleAddRow = (parentIndex, childIndex, data) => {
  //   dispatch({ type: "addParentRow", data, parentIndex });
  // };

  // const closeAddRowModal = () => {
  //   setAddRowConfig({});
  //   setShowAddRowModal(false);
  // };

  return (
    <>
      <DataGrid
        rowKeyGetter={(row) => row.id}
        rows={state.rows}
        columns={columns}
        style={{ height: "100vh" }}
        // rowRenderer={RowRenderer}
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
    </>
  );
}

export default Home;
