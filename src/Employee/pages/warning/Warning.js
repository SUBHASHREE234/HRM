import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import CompanyLogoFile from "../../components/CompanyLogoFile";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import DataNotFound from "../../../Hr/asset/images/no data 1.png";
import logo from "../../../Hr/asset/images/logo.png";
import header from "../../../Hr/asset/images/Header.png";
import footer from "../../../Hr/asset/images/Footer.png";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { styled } from "@mui/system";

const Warning = () => {
    // const token = localStorage.getItem("AuthToken");
    // const decoded = jwtDecode(String(token));
    // const usernameRec = decoded.preferred_username;
    // const username = usernameRec.toUpperCase();
  
    const [warning, setWarning] = useState([]);
    const username = localStorage.getItem("UserName")


    const loadWarning = async () => {
        const response = await axios.get(`http://localhost:8082/warnings/findwarnings/${username}`);
        setWarning(response.data);
      };
    
      console.log("poli", warning);

      useEffect(() => {
        loadWarning();
      }, []);
  

      const [search, setSearch] = useState("");
      const CustomTablePagination = styled(TablePagination)`
        & .${classes.toolbar} {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 0 0 0 10px;
    
          @media (min-width: 768px) {
            flex-direction: row;
            align-items: center;
          }
        }
    
        & .${classes.selectLabel} {
          margin: 0;
        }
    
        & .${classes.displayedRows} {
          margin: 0;
    
          @media (min-width: 768px) {
            margin-left: auto;
          }
        }
    
        & .${classes.spacer} {
          display: none;
        }
    
        & .${classes.actions} {
          display: flex;
          gap: 0rem;
        }
      `;


      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
      const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - warning.length) : 0;
    
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
      let doc;
      const convertToPdf = () => {
        try {
          doc = new jsPDF();
          const centerX = (doc.internal.pageSize.width - 80) / 2;
          doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
          doc.addImage(
            footer,
            "PNG",
            0,
            doc.internal.pageSize.height - 35,
            doc.internal.pageSize.width,
            35
          );
          const logoUrl = logo;
          doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
          const tableMargin = 20;
          const tableStartY = 15 + tableMargin;
          doc.autoTable({
            head: [["SL", "WARNING TO EMPLOYEE", "WARNING TYPE", "SUBJECT", "WARNING BY EMPLOYEE", "WARNING DATE", "DESCRIPTION"]],
            body: warning.map((row, index) => [
              index + 1,
              row.employeeName,
              row.warningType,
              row.subject,
              row.warningByEmployee,
              row.warningDate,
              row.description,
            ]),
            styles: { fontSize: 5, fontStyle: "normal" },
            headStyles: {
              fillColor: [206, 206, 206],
              textColor: [20, 25, 40],
              fontSize: 5,
              fontStyle: "bold",
              width: 20,
            },
            startY: tableStartY,
          });
          doc.save("policies.pdf");
        } catch (error) {
          console.error("Error creating PDF:", error);
        }
      };

      const createPdf = () => {
        try {
          doc = new jsPDF();
          const centerX = (doc.internal.pageSize.width - 80) / 2;
          doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
          doc.addImage(
            footer,
            "PNG",
            0,
            doc.internal.pageSize.height - 35,
            doc.internal.pageSize.width,
            35
          );
          const logoUrl = logo;
          doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
          const tableMargin = 20;
          const tableStartY = 15 + tableMargin;
          doc.autoTable({
            head: [["SL", "WARNING TO EMPLOYEE", "WARNING TYPE", "SUBJECT", "WARNING BY EMPLOYEE", "WARNING DATE", "DESCRIPTION"]],
            body: warning.map((row, index) => [
              index + 1,
              row.employeeName,
              row.warningType,
              row.subject,
              row.warningByEmployee,
              row.warningDate,
              row.description,
            ]),
            styles: { fontSize: 5, fontStyle: "normal" },
            headStyles: {
              fillColor: [206, 206, 206],
              textColor: [20, 25, 40],
              fontSize: 5,
              fontStyle: "bold",
              width: 20,
            },
            startY: tableStartY,
          });
        } catch (error) {
          console.error("Error creating PDF:", error);
        }
      };
    

      const convertToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(warning);
    
        ws["!cols"] = [
          { width: 20 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
        ];
    
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "policies.xlsx");
      };

      const handlePrint = () => {
        createPdf();
        const pdfContent = doc.output("bloburl");
    
        if (pdfContent) {
          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Document</title>
                <style>
                @media print {
                  body {
                    margin: 0;
                  }
                  #pdfFrame {
                    width: 100%;
                    height: 100%;
                  }
                  @page {
                    size: landscape;
                  }
                }
              </style>
              </head>
              <body>
                <iframe id="pdfFrame" src="${pdfContent}" width="100%" height="100%"></iframe>
                <script>
                  document.getElementById('pdfFrame').onload = function() {
                    setTimeout(function() {
                      window.print();
                      window.onafterprint = function() {
                        window.close();
                      };
                    }, 1000);
                  };
                </script>
              </body>
            </html>
          `);
        }
      };


      const renderwarningData = () => {
        return (
          <tr>
            <td colSpan="12" className="text-center">
              <img style={{ margin: "50px 0 50px 0" }} src={DataNotFound}></img>
              <h1>No Data Found!</h1>
              <p>
                It Looks like there is no data to display in this table at the
                moment
              </p>
            </td>
          </tr>
        );
      };
    
     
      
      const [menu, setMenu] = useState(false);
    
      return (
        <div>
          <div id="header-container" className="header-container">
            <CompanyLogoFile />
            <Header menu={menu} setMenu={setMenu} />
          </div>
          <div className="dashboard-container">
            <SideBar menu={menu} setMenu={setMenu} />
            <div className="head-foot-part">
              <div className="page">
                <div
                  className="d-flex"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div className=" table-ka-top-btns" style={{ marginTop: "30px" }}>
                    {
                      <div className="search-print">
                        <input
                          type="text"
                          className="search-beside-btn"
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          style={{
                            width: "20rem",
                            borderRadius: "5px",
                            height: "40px",
                            padding: "10px",
                            border: "1px solid rgba(247, 108, 36, 1)",
                            marginRight: "30px",
                          }}
                        />
                        <div
                          className="d-flex mt-4 four-btn"
                          style={{ gap: "10px" }}
                          y
                        >
                          <button
                            className=""
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              width: "100px",
                              justifyContent: "center",
                            }}
                            onClick={handlePrint}
                          >
                            PRINT
                          </button>
                          <button
                            onClick={convertToPdf}
                            className=""
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              width: "100px",
                              justifyContent: "center",
                            }}
                          >
                            PDF
                          </button>
                          <button
                            onClick={convertToExcel}
                            className=""
                            style={{
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              width: "100px",
                              justifyContent: "center",
                            }}
                          >
                            EXCEL
                          </button>
                          <CSVLink
                            data={warning}
                            filename="warning.csv"
                            style={{ textDecoration: "none" }}
                          >
                            <button
                              className=""
                              style={{
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                width: "100px",
                                justifyContent: "center",
                              }}
                            >
                              CSV
                            </button>
                          </CSVLink>
                        </div>
                      </div>
                    }
                  </div>
    
                  <div className="table-start-container">
                    <table
                      id="table"
                      className="table table-bordered table-hover shadow"
                    >
                      <thead>
                        <tr className="text-center">
                          <th>SL</th>
                          <th>Warning To Employee</th>
                          <th>Warning Type</th>
                          <th>Subject</th>
                          <th>Warning By Employee</th>
                          <th>Warning Date</th>
                          <th>Description</th>
                          <th colSpan={3}>Action</th>
                        </tr>
                      </thead>
    
                      <tbody className="text-center">
                        {warning?.length === 0
                          ? renderwarningData()
                          : (rowsPerPage > 0
                              ? warning?.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                              : warning
                            )
                              .filter((elem) => {
                                if (search.length === 0) return elem;
                                else
                                  return (
                                    elem.employeeName
                                      .toLowerCase()
                                      .includes(search.toLocaleLowerCase()) ||
                                    elem.warningType
                                      .toLowerCase()
                                      .includes(search.toLocaleLowerCase()) ||
                                    elem.subject
                                      .toLowerCase()
                                      .includes(search.toLocaleLowerCase()) ||
                                    elem.warningDate
                                      .toLowerCase()
                                      .includes(search.toLocaleLowerCase()) ||
                                     elem.description
                                      .toLowerCase()
                                      .includes(search.toLocaleLowerCase())  
                                  );
                              })
                              .map((warning, index) => (
                                <tr key={index}>
                                  <th scope="row" key={index}>
                                    {index + 1}
                                  </th>
                                  <td>{warning.employeeName}</td>
                                  <td>{warning.warningType}</td>
                                  <td>{warning.subject}</td>
                                  <td>{warning.warningDate}</td>
                                  <td>{warning.description}</td>
    
                                  <td className="mx-2">
                                    <Link
                                      to={`/employee/warning-profile/${warning.warningsId}`}
                                    >
                                      <FaEye className="action-eye" />
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <CustomTablePagination
                            className="pagingg"
                            rowsPerPageOptions={[
                              5,
                              10,
                              25,
                              { label: "All", value: -1 },
                            ]}
                            colSpan={12}
                            count={warning.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                              select: {
                                "aria-label": "rows per page",
                              },
                              actions: {
                                // showFirstButton: true,
                                // showLastButton: true,
                              },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Warning;
    