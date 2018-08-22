import Table from "./components/table";
import Column from "./components/column";
import PagedTable from "./components/pagedtable";
import Styler from "./components/rowstyler";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faCheckCircle, faSortUp, faSortDown, faFilter, faAngleUp, faAngleDown, faTimes, faCog } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

library.add(faSort, faCircle, faCheckCircle, faSortUp, faSortDown, faFilter, faAngleUp, faAngleDown, faTimes, faCog);

export { Table, Column, PagedTable, Styler };
