import React, { useReducer, useMemo, useState } from "react";
import DataGrid, { TextEditor, Row as GridRow } from "react-data-grid";
import _ from "lodash";
import faker from "faker";
// import AddRowModal from "../components/AddRowModal";
import ConfirmPopup from "../components/ConfirmPopup";
import { v4 as uuidv4 } from "uuid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  ContextMenu,
  MenuItem,
  SubMenu,
  ContextMenuTrigger,
} from "react-contextmenu";
import { CellExpanderFormatter } from "../helpers/CellExpanderFormatter";
import { SelectEditor } from "../helpers/SelectEditor";

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

function calculateIndividualTotals(data) {
  const fieldsForSum = ["2020", "2021", "2022", "2023", "2024", "2025"];
  _.each(data, (item0) => {
    _.forEach(fieldsForSum, (field) => {
      item0[field] = _.sumBy(item0.children, field);
    });
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
  const { children } = row;
  if (!children) return { rows: rows };

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
  const { rows } = state;
  if (!data.parentId) {
    return;
  }
  const parentRowIndex = rows.findIndex((r) => r.id === data.parentId);
  const newRow = _.extend(
    {
      id: uuidv4(),
      childLevel: 1,
    },
    { ...data }
  );
  //find parent item
  //get parent item index
  //add new item as children
  //add item in expanded rows
}

// function addParentRow(state, index, data) {
//   let { rows } = state;
//   rows.splice(index, 0, data);
//   return { rows: rows };
// }

// function deleteRow(state, index) {
//   let { rows } = state;
//   // console.log(index);
//   rows.splice(index, 1);
//   return { rows: rows };
// }

function reducer(state, action) {
  switch (action.type) {
    case "toggleSubRow":
      return toggleSubRow(state, action.id);
    case "deleteSubRow":
      return deleteSubRow(state, action.id);
    case "insertSubRow":
      return insertSubRow(state, action.data);
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

function RowRenderer(props) {
  return (
    <ContextMenuTrigger
      id="grid-context-menu"
      collect={() => ({ rowIdx: props.rowIdx })}
    >
      <GridRow {...props} />
    </ContextMenuTrigger>
  );
}

function showAddRowModal(parentIndex, childIndex) {
  // console.log("Adding New Row for", parentIndex, childIndex);
}

function Home() {
  const data = calculateIndividualTotals(createMultiLevelData());
  const [state, dispatch] = useReducer(reducer, { rows: data });
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteRowValue, setDeleteRowValue] = useState({});
  const [addRowConfig, setAddRowConfig] = useState({});

  const summaryRows = useMemo(() => {
    // var row = _.map(state.rows, (key) => {
    //   return {
    //     "2020Count": _.sumBy(state.rows, "2020"),
    //     "2021Count": _.sumBy(state.rows, "2021"),
    //     "2022Count": _.sumBy(state.rows, "2022"),
    //     "2023Count": _.sumBy(state.rows, "2023"),
    //     "2024Count": _.sumBy(state.rows, "2024"),
    //   };
    // });
    // const summaryRow = row[0];
    // return [summaryRow];
  }, [state.rows]);

  const columns = [
    {
      key: "title",
      name: "Budget",
      width: 240,
      frozen: true,
      formatter({ row, isCellSelected }) {
        const hasChildren = row.children && row.children.length > 0;
        return (
          <>
            {hasChildren && (
              <CellExpanderFormatter
                isCellSelected={isCellSelected}
                expanded={row.isExpanded === true}
                onCellExpand={() =>
                  dispatch({ id: row.id, type: "toggleSubRow" })
                }
              />
            )}
            <div
              class="row-pad"
              style={{ textAlign: "left", marginLeft: row.childLevel * 26 }}
            >
              {row.title}

              {row.childLevel > 0 && (
                <span className="ml-2" onClick={() => handleDeleteItem(row)}>
                  <span className="trash">
                  <FontAwesomeIcon icon={faTrash} />
                  </span>
                                  </span>
              )}
            </div>
          </>
        );
      },
      editor: (p) => (
        <SelectEditor
          value={p.row.title}
          onChange={(value) => p.onRowChange({ ...p.row, title: value }, true)}
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
            {currencyFormatter.format(value)}
          </div>
        );
      },
      // summaryFormatter: ({ row }) => totalView(row, "2020Count"),
    },
    {
      key: "2021",
      name: "FY 2021",
      width: 150,
      editor: TextEditor,
      formatter: (props) => {
        const value = props.row["2021"];
        return (
          <div class="row-pad" style={{ textAlign: "right" }}>
            {currencyFormatter.format(value)}
          </div>
        );
      },
      // summaryFormatter: ({ row }) => totalView(row, "2021Count"),
    },
    {
      key: "2022",
      name: "FY 2022",
      width: 150,
      editor: TextEditor,
      formatter: (props) => {
        const value = props.row["2022"];
        return (
          <div class="row-pad" style={{ textAlign: "right" }}>
            {currencyFormatter.format(value)}
          </div>
        );
      },
      // summaryFormatter: ({ row }) => totalView(row, "2022Count"),
    },
    {
      key: "2023",
      name: "FY 2023",
      editor: TextEditor,
      width: 150,
      formatter: (props) => {
        const value = props.row["2023"];
        return (
          <div class="row-pad" style={{ textAlign: "right" }}>
            {currencyFormatter.format(value)}
          </div>
        );
      },
      // summaryFormatter: ({ row }) => totalView(row, "2023Count"),
    },
    {
      key: "2024",
      name: "FY 2024",
      width: 150,
      editor: TextEditor,
      formatter: (props) => {
        const value = props.row["2024"];
        return (
          <div class="row-pad" style={{ textAlign: "right" }}>
            {currencyFormatter.format(value)}
          </div>
        );
      },
      // summaryFormatter: ({ row }) => totalView(row, "2024Count"),
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
        columns={columns}
        rows={state.rows}
        style={{ height: "100vh" }}
        rowRenderer={RowRenderer}
        summaryRows={summaryRows}
        className="fill-grid"
      />
      {/* <ContextMenu id="grid-context-menu">
        <MenuItem onClick={onRowDelete}>Delete Row</MenuItem>
        <MenuItem onClick={onRowInsertParent}>Insert Parent</MenuItem>
        <MenuItem onClick={onRowInsertChild}>Insert Child</MenuItem>
      </ContextMenu> */}
      {/* <AddRowModal
        isOpen={showAddRowModal}
        toggle={closeAddRowModal}
        data={addRowConfig}
        onAddRow={handleAddRow}
      /> */}
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
