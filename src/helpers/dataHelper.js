import _ from "lodash";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";

export function calculateChildrenTotal(item) {
  const fieldsForSum = ["2020", "2021", "2022", "2023", "2024", "2025"];
  _.each(fieldsForSum, (field) => {
    item[field] = _.sumBy(item.children, field);
  });
  return item;
}

export function calculateDataTotals(data) {
  _.each(data, (item0) => {
    item0 = calculateChildrenTotal(item0);
  });
  return data;
}

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

function generateMockData(rowCount) {
  const l1 = createData(rowCount, 0);
  _.each(l1, (item0) => {
    const l2 = createData(faker.random.number({ min: 1, max: 4 }), 1, {
      parentId: item0.id,
    });
    item0.children = l2;
  });
  return l1;
}

export const generateDepartmentData = () => {
  return [
    {
      department: "Mathematics",
      data: calculateDataTotals(generateMockData(6)),
    },
    {
      department: "Science",
      data: calculateDataTotals(generateMockData(2)),
    },
    {
      department: "Finance",
      data: calculateDataTotals(generateMockData(4)),
    },
  ];
};

export const getDepartments = () => {
  return ["Mathematics", "Science", "Finance"];
};
