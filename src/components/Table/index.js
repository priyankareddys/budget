import React, { useState, useEffect, useRef } from "react";
import { css } from "@emotion/css";
import Pagination from "../Pagination";
import { FaPlus } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { HiSave } from "react-icons/hi";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { AiOutlineDelete, AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";

const Table = () => {
  const Data = [
    {
      id: "netsales",
      title: "Net Sales",
      totalAmount: "6,674,509.48",
      balancedAmount: "6,300,000.00",
      actualAmount: "7,235,685.00",
      forecastAmount: "8,950,000.00",
      subIncome: [
        {
          title: "Sales Returns and Allowances",
          totalAmount: "-42.928.79",
          balancedAmount: "-39.949.33",
          actualAmount: "343.859.53",
          forecastAmount: "-339.074.08",
        },
        {
          title: "Total Revenue",
          totalAmount: "6,674,509.48",
          balancedAmount: "6,300,000.00",
          actualAmount: "7,235,685.00",
          forecastAmount: "8,950,000.00",
        },
      ],
    },
    {
      id: "costofgoodsold",
      title: "Cost Of Goods sold",
      totalAmount: "5,123,745.48",
      balancedAmount: "4,758,965.00",
      actualAmount: "3,789,357.00",
      forecastAmount: "1,586,856.00",
      subIncome: [
        {
          title: "Cogs - Third Party",
          totalAmount: "-42.928.79",
          balancedAmount: "-39.949.33",
          actualAmount: "343.859.53",
          forecastAmount: "-339.074.08",
        },
        {
          title: "Cogs - Scrap",
          totalAmount: "6,674,509.48",
          balancedAmount: "6,300,000.00",
          actualAmount: "7,235,685.00",
          forecastAmount: "8,950,000.00",
        },
      ],
    },
    {
      id: "contribution",
      title: "Contribution",
      totalAmount: "8,963,748.48",
      balancedAmount: "5,785,358.00",
      actualAmount: "6,158,000.00",
      forecastAmount: "7,854,358.00",
    },
    {
      title: "Contribution Margins",
      totalAmount: "48.04%",
      balancedAmount: "50.00%",
      actualAmount: "68.00%",
      forecastAmount: "90.58%",
    },
  ];

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isData, setIsData] = useState([]);
  const [isItem, setIsItem] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const editNumber = useRef(null);

  const displayData = (id) => {
    setShow(show === id ? true : id);
  };

  const isDoubleClick = (id) => {
    setShowEdit(showEdit === id ? true : id);
    setIsEdit(isEdit === id ? true : id);
  };

  let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  let uniqid = randLetter + Date.now();

  const getUniqId = () => {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let uniqid = randLetter + Date.now();
    return uniqid;
  };

  useEffect(() => {
    setIsData(Data);
  }, []);

  const deleteItem = (item) => {
    const delItem = isData.indexOf(item);
    if (delItem > -1) {
      isData.splice(delItem, 1);
      setIsData([...isData]);
    }
  };

  const editItem = (item, id) => {
    for (let item of isData) {
      if (item.id === id) {
        item.isModified = true;
        item.totalAmount =
          editNumber && editNumber.current && editNumber.current.value;
        setIsData([...isData]);
        setIsEdit(false);
      }
    }
    console.log("dayauyaua", isData);
  };

  const closeBox = () => {
    setShowEdit(false);
  };

  const toggleRow = () => {
    setShow(null);
  };

  const addItemBox = () => {
    setIsItem(!isItem);
  };

  const addSubItem = (index) => {
    const subItemTemplate = {
      title: "",
      totalAmount: "",
      balancedAmount: "",
      actualAmount: "",
      forecastAmount: "",
      isNewItem: true,
    };
    let data = [...isData];
    if (data[index].subIncome) {
      data[index].subIncome.push(subItemTemplate);
    } else {
      data[index].subIncome = [subItemTemplate];
    }
    setIsData(data);
    console.log(data);
  };

  return (
    <>
      {isItem && (
        <div
          className={css`
            width: 100%;
            max-width: 1170px;
            margin: 0 auto;
            padding: 10px 25px;
            box-shadow: 2px 10px 35px 1px rgba(153, 153, 153, 0.3);
            position: absolute;
            top: 115px;
            z-index: 9999;
            left: 0;
            right: 0;
            background: white;
          `}
        >
          <Formik
            initialValues={{
              id: uniqid,
              title: "ddd",
              actualAmount: "",
              balancedAmount: "",
              forecastAmount: "",
              totalAmount: "",
            }}
            onSubmit={(values) => {
              isData.push(values);
              setIsData([...isData]);
              setIsItem(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <ul
                  className={css`
                    list-style: none;
                    display: flex;
                    justify-content: space-between;
                  `}
                >
                  <li className>
                    <label
                      className={css`
                        display: flex;
                        justtify-content: flex-start;
                        padding: 0 0 5px 0;
                      `}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      placeholder="Title"
                    />
                  </li>
                  <li>
                    <label
                      className={css`
                        display: flex;
                        justtify-content: flex-start;
                        padding: 0 0 5px 0;
                      `}
                    >
                      Actual Amount
                    </label>
                    <input
                      type="text"
                      name="actualAmount"
                      className="input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.actualAmount}
                      placeholder="Actual Amount"
                    />
                  </li>
                  <li>
                    <label
                      className={css`
                        display: flex;
                        justtify-content: flex-start;
                        padding: 0 0 5px 0;
                      `}
                    >
                      Balanced Amount
                    </label>
                    <input
                      type="text"
                      name="balancedAmount"
                      className="input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.balancedAmount}
                      placeholder="Balanced Amount"
                    />
                  </li>
                  <li>
                    <label
                      className={css`
                        display: flex;
                        justtify-content: flex-start;
                        padding: 0 0 5px 0;
                      `}
                    >
                      Forecast Amount
                    </label>
                    <input
                      type="text"
                      name="forecastAmount"
                      className="input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.forecastAmount}
                      placeholder="Forecast Amount"
                    />
                  </li>
                  <li>
                    <label
                      className={css`
                        display: flex;
                        justtify-content: flex-start;
                        padding: 0 0 5px 0;
                      `}
                    >
                      Total Amount
                    </label>
                    <input
                      type="text"
                      name="totalAmount"
                      className="input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.totalAmount}
                      placeholder="Total Amount"
                    />
                  </li>
                </ul>
                <ul
                  className={css`
                    list-style: none;
                    display: flex;
                    justify-content: space-between;
                  `}
                >
                  <li>
                    <button className="btn btn-primary" type="submit">
                      Add
                    </button>
                  </li>
                </ul>
              </form>
            )}
          </Formik>
        </div>
      )}

      {/*<Accordion />*/}

      <div
        className={css`
          width: 100%;
          max-width: 1170px;
          margin: 0 auto;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
            align-items: center;
          `}
        >
          <div onClick={addItemBox}>
            <Button>
              Add <FaPlus />
            </Button>
          </div>
          {/* <div>
            <Pagination />{" "}
          </div> */}
        </div>
        <div
          className={css`
            margin-top: 50px;
            & > table {
              border: 1px solid #ddd;
              & > tr {
                & > td {
                  border-bottom: 1px solid #ddd;
                }
                &:nth-last-child(1) {
                  & > td {
                    border: none;
                  }
                }
              }
            }
          `}
        >
          {isData && isData.length > 0 ? (
            <table
              border="0"
              cellPadding="10"
              cellSpacing="0"
              width="100%"
              className="budgetAir_table"
            >
              {isData.map((item, index) => (
                <>
                  <tr
                    key={item.id}
                    style={
                      show === item.id
                        ? { backgroundColor: "#F5F5F5" }
                        : { backgroundColor: "inherit" }
                    }
                  >
                    <td
                      className={css`
                        display: flex;
                        cursor: pointer;
                        align-items: center;
                        flex-direction: row-reverse;
                        justify-content: flex-end;
                      `}
                      style={{ fontWeight: "bold", textAlign: "left" }}
                      onClick={() => displayData(item.id)}
                    >
                      {item.title}
                      <span
                        className={
                          show === item.id
                            ? css`
                                transform: rotate(90deg);
                                display: inline-block;
                                cursor: pointer;
                              `
                            : css`
                                transform: rotate(0deg);
                                display: inline-block;
                                cursor: pointer;
                              `
                        }
                      >
                        <RiArrowRightSLine />
                      </span>
                    </td>
                    <td width="15%">{item.actualAmount}</td>
                    <td width="15%">{item.balancedAmount}</td>
                    <td width="15%">{item.forecastAmount}</td>
                    <td
                      width="15%"
                      onDoubleClick={() => isDoubleClick(item.id)}
                    >
                      {isEdit === item.id ? (
                        <div
                          className={css`
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                          `}
                        >
                          <input
                            type="text"
                            ref={editNumber}
                            className="input input__small"
                          />
                          <button
                            onClick={() => editItem(item, item.id)}
                            className={css`
                              display: flex;
                              height: 30px;
                              background: #0069ff;
                              color: white;
                              font-size: 11px;
                              border: 0;
                              cursor: pointer;
                              align-items: center;
                              justify-content: center;
                            `}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span
                          style={
                            item?.isModified === true
                              ? { backgroundColor: "orange" }
                              : { backgroundColor: "inherit" }
                          }
                        >
                          {item.totalAmount}
                        </span>
                      )}
                    </td>
                    {showEdit === item.id && (
                      <div
                        className={css`
                          position: absolute;
                          right: 10px;
                          top: 160px;
                          background-color: #fff;

                          box-shadow: 0px 0px 5px #ddd;
                          & > span {
                            display: block;
                            margin: 3px 0px;
                            padding: 10px;
                            cursor: pointer;
                            border-bottom: 1px solid #ddd;
                            &:nth-last-child(1) {
                              border: none;
                            }
                          }
                        `}
                      >
                        <span>
                          <HiSave />
                        </span>
                        <span onClick={() => editItem(item, item.id)}>
                          <AiOutlineEdit />
                        </span>
                        <span on>
                          <AiOutlineDelete onClick={() => deleteItem(item)} />
                        </span>
                        <span onClick={() => closeBox(false)}>
                          <AiOutlineClose />
                        </span>
                      </div>
                    )}
                    {show === item.id && (
                      <div
                        className={css`
                          position: absolute;
                          right: 10px;
                          top: 160px;
                          background-color: #fff;

                          box-shadow: 0px 0px 5px #ddd;
                          & > span {
                            display: block;
                            margin: 3px 0px;
                            padding: 10px;
                            cursor: pointer;
                            border-bottom: 1px solid #ddd;
                            &:nth-last-child(1) {
                              border: none;
                            }
                          }
                        `}
                      >
                        {/* <span>
                          <HiSave />
                        </span> */}
                        <span onClick={() => addSubItem(index)}>
                          <AiOutlinePlus />
                        </span>
                        <span on>
                          <AiOutlineDelete onClick={() => deleteItem(item)} />
                        </span>
                        <span onClick={() => toggleRow()}>
                          <AiOutlineClose />
                        </span>
                      </div>
                    )}
                  </tr>
                  <tr>
                    {show === item.id && (
                      <td
                        colSpan="5"
                        className={css`
                          padding: 0;
                        `}
                      >
                        {" "}
                        {item &&
                          item.subIncome &&
                          item.subIncome.map((sub, subIndex) => {
                            return sub.isNewItem ? (
                              <Formik
                                initialValues={{
                                  id: getUniqId(),
                                  title: "",
                                  actualAmount: "",
                                  balancedAmount: "",
                                  forecastAmount: "",
                                  totalAmount: "",
                                }}
                                onSubmit={(values) => {
                                  let data = [...isData];
                                  data[index].subIncome[subIndex] = values;
                                  setIsData(data);
                                  setIsItem(false);
                                }}
                              >
                                {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting,
                                }) => (
                                  <form
                                    onSubmit={(event) => {
                                      event.preventDefault();
                                      handleSubmit(values);
                                    }}
                                  >
                                    <table
                                      border="0"
                                      cellPadding="10"
                                      cellSpacing="0"
                                      width="100%"
                                      className="budgetAir_table_inner"
                                    >
                                      {" "}
                                      <tr>
                                        <td
                                          style={{
                                            fontWeight: "500",
                                            paddingLeft: "60px",
                                            textAlign: "left",
                                          }}
                                        >
                                          <input
                                            type="text"
                                            name="title"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                            placeholder="Title"
                                          />
                                        </td>
                                        <td width="15%">
                                          <input
                                            type="text"
                                            name="actualAmount"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.actualAmount}
                                            placeholder="Actual Amount"
                                          />
                                        </td>
                                        <td width="15%">
                                          <input
                                            type="text"
                                            name="balancedAmount"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.balancedAmount}
                                            placeholder="Balanced Amount"
                                          />
                                        </td>
                                        <td width="15%">
                                          <input
                                            type="text"
                                            name="forecastAmount"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.forecastAmount}
                                            placeholder="Forecast Amount"
                                          />
                                          {sub.forecastAmount}
                                        </td>
                                        <td width="15%">
                                          <input
                                            type="text"
                                            name="totalAmount"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.totalAmount}
                                            placeholder="Total Amount"
                                          />
                                          {}
                                        </td>
                                        <td>
                                          <button
                                            className="btn btn-primary"
                                            type="submit"
                                          >
                                            Add
                                          </button>
                                        </td>
                                      </tr>
                                    </table>
                                  </form>
                                )}
                              </Formik>
                            ) : (
                              <table
                                border="0"
                                cellPadding="10"
                                cellSpacing="0"
                                width="100%"
                                className="budgetAir_table_inner"
                              >
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: "500",
                                      paddingLeft: "60px",
                                      textAlign: "left",
                                    }}
                                  >
                                    {sub.title}
                                  </td>
                                  <td width="15%">{sub.actualAmount}</td>
                                  <td width="15%">{sub.balancedAmount}</td>
                                  <td width="15%">{sub.forecastAmount}</td>
                                  <td width="15%">{sub.totalAmount}</td>
                                </tr>
                              </table>
                            );
                          })}
                      </td>
                    )}
                  </tr>
                </>
              ))}
            </table>
          ) : (
            <h1>No Data Available</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
