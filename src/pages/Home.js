import React, { useReducer, useMemo } from 'react';
import DataGrid, { TextEditor, Row as GridRow } from 'react-data-grid';
import _ from 'lodash';
import faker from 'faker';
import { createPortal } from 'react-dom';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from 'react-contextmenu';
import { CellExpanderFormatter } from '../helpers/CellExpanderFormatter';
import { SelectEditor } from '../helpers/SelectEditor';


const currencyFormatter = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'usd'
});

function createData(count, level) {
    const rows = [];
    for (let i = 0; i < count; i++) {
        rows.push(
            {
                id: faker.random.number(),
                title: faker.finance.accountName(),
                2019: faker.random.float(),
                2020: faker.random.float(),
                2021: faker.random.float(),
                2022: faker.random.float(),
                2023: faker.random.float(),
                2024: faker.random.float(),
                2025: faker.random.float(),
                2026: faker.random.float(),
                2027: faker.random.float(),
                2028: faker.random.float(),
                childLevel: level,
                isExpanded: false,
            }
        )
    }
    return rows
}

function createMultiLevelData() {
    const l1 = createData(50, 0)
    _.each(l1, item0 => {
        const l2 = createData(2, 1)
        // _.each(l2, item1 => {
        //     const l3 = createData(2, 2)
        //     item1.children = l3
        // })
        item0.children = l2
    })
    return l1
}

const defaultRows = [
    {
        id: 0,
        title: 'Net Sales',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    },
    {
        id: 5,
        title: 'Revenue',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    },
    {
        id: 6,
        title: 'Funds',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    },
    {
        id: 7,
        title: 'Charity',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    },
    {
        id: 8,
        title: 'Charity',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    },
    {
        id: 9,
        title: 'Charity',
        2019: faker.random.float(),
        2020: faker.random.float(),
        2021: faker.random.float(),
        2022: faker.random.float(),
        2023: faker.random.float(),
        2024: faker.random.float(),
        2025: faker.random.float(),
        2026: faker.random.float(),
        2027: faker.random.float(),
        2028: faker.random.float(),
    }
];

function toggleSubRow(state, id) {
    const { rows } = state
    const rowIndex = rows.findIndex(r => r.id === id);
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
    const { rows } = state
    const row = rows.find(r => r.id === id);
    if (!row || !row.parentId) return rows;

    // Remove sub row from flattened rows.
    const newRows = rows.filter(r => r.id !== id);

    // Remove sub row from parent row.
    const parentRowIndex = newRows.findIndex(r => r.id === row.parentId);
    const { children } = newRows[parentRowIndex];
    if (children) {
        const newChildren = children.filter(sr => sr.id !== id);
        newRows[parentRowIndex] = { ...newRows[parentRowIndex], children: newChildren };
    }

    return { rows: newRows };
}

function reducer(state, action) {
    switch (action.type) {
        case 'toggleSubRow':
            return toggleSubRow(state, action.id);
        case 'deleteSubRow':
            return deleteSubRow(state, action.id);
        default:
            return state;
    }
}

function currencyView(props, key) {
    const value = props.row[key];
    return <div style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
}

function totalView(row, key) {
    return <strong><div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(row[key])}</div></strong>;
}

function RowRenderer(props) {
    return (
        <ContextMenuTrigger id="grid-context-menu" collect={() => ({ rowIdx: props.rowIdx })}>
            <GridRow {...props} />
        </ContextMenuTrigger>
    );
}

function Home() {

    const data = createMultiLevelData()
    const [state, dispatch] = useReducer(reducer, { rows: data });

    const summaryRows = useMemo(() => {
        var row = _.map(state.rows, key => {
            return {
                '2019Count': _.sumBy(state.rows, '2019'),
                '2020Count': _.sumBy(state.rows, '2020'),
                '2021Count': _.sumBy(state.rows, '2021'),
                '2022Count': _.sumBy(state.rows, '2022'),
                '2023Count': _.sumBy(state.rows, '2023'),
                '2024Count': _.sumBy(state.rows, '2024'),
                '2025Count': _.sumBy(state.rows, '2025'),
                '2026Count': _.sumBy(state.rows, '2026'),
                '2027Count': _.sumBy(state.rows, '2027'),
                '2028Count': _.sumBy(state.rows, '2028'),

            }
        })

        const summaryRow = row[0]
        return [summaryRow];
    }, [state.rows]);

    const columns = [
        {
            key: 'title',
            name: 'Budget',
            width: 240,
            frozen: true,
            formatter({ row, isCellSelected }) {
                const hasChildren = (row.children && row.children.length > 0);
                return (
                    <>
                        {
                            hasChildren &&
                            (
                                <CellExpanderFormatter
                                    isCellSelected={isCellSelected}
                                    expanded={row.isExpanded === true}
                                    onCellExpand={() => dispatch({ id: row.id, type: 'toggleSubRow' })}
                                />
                            )
                        }
                        <div class="row-pad" style={{ textAlign: 'left', marginLeft: row.childLevel * 26 }}>{row.title}</div>
                    </>
                );
            },
            editor: p => (
                <SelectEditor
                    value={p.row.title}
                    onChange={value => p.onRowChange({ ...p.row, title: value }, true)}
                    options={defaultRows.map(c => ({ value: c.id, label: c.title }))}
                    rowHeight={p.rowHeight}
                    menuPortalTarget={p.editorPortalTarget}
                />
            )
        },
        {
            key: '2019',
            name: 'FY 2019',
            width: 150,
            formatter: (props) => {
                const value = props.row['2019'];
                return <div class="row-pad" style={{ textAlign: 'right', backgroundColor:'#e9e9e9'}}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2019Count')
        },
        {
            key: '2020',
            name: 'FY 2020',
            width: 150,
            formatter: (props) => {
                const value = props.row['2020'];
                return <div class="row-pad" style={{ textAlign: 'right', backgroundColor: '#e9e9e9' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2020Count')
        },
        {
            key: '2021',
            name: 'FY 2021',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2021'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2021Count')
        },
        {
            key: '2022',
            name: 'FY 2022',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2022'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2022Count')
        },
        {
            key: '2023',
            name: 'FY 2023',
            editor: TextEditor,
            width: 150,
            formatter: (props) => 
            {
                const value = props.row['2023'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2023Count')
        },
        {
            key: '2024',
            name: 'FY 2024',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2024'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2024Count')
        },
        {
            key: '2025',
            name: 'FY 2025',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2025'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2025Count')
        },
        {
            key: '2026',
            name: 'FY 2026',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2026'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2026Count')
        },
        {
            key: '2027',
            name: 'FY 2027',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2027'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2027Count')
        },
        {
            key: '2028',
            name: 'FY 2028',
            width: 150,
            editor: TextEditor,
            formatter: (props) => 
            {
                const value = props.row['2028'];
                return <div class="row-pad" style={{ textAlign: 'right' }}>{currencyFormatter.format(value)}</div>
            },
            summaryFormatter: ({ row }) => totalView(row, '2028Count')
        },
    ];

    function onRowDelete(e, { rowIdx }) {
        alert(`Will delete row at index ${rowIdx}`)
    }

    function onRowInsertParent(e, { rowIdx }) {
        alert(`Will create a parent row at index ${rowIdx}`)
    }

    function onRowInsertChild(e, { rowIdx }) {
        alert(`Will create a child row at index ${rowIdx}`)
    }

    return (
        <>
            <DataGrid
                rowKeyGetter={row => row.id}
                columns={columns}
                rows={state.rows}
                style={{ height: '720px' }}
                rowRenderer={RowRenderer}
                summaryRows={summaryRows}
                className="fill-grid"
            />
            <ContextMenu id="grid-context-menu">
                <MenuItem onClick={onRowDelete}>Delete Row</MenuItem>
                <MenuItem onClick={onRowInsertParent}>Insert Parent</MenuItem>
                <MenuItem onClick={onRowInsertChild}>Insert Child</MenuItem>
            </ContextMenu>
        </>
    );
}

export default Home;