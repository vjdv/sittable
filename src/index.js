import Table from "./components/table";
import Column from "./components/column";
import PagedTable from "./components/pagedtable";
import Styler from "./components/rowstyler";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faSortUp, faSortDown, faFilter, faBackward, faFastBackward, faForward, faFastForward } from "@fortawesome/free-solid-svg-icons";

library.add(faSort, faSortUp, faSortDown, faFilter, faBackward, faFastBackward, faForward, faFastForward);

export { Table, Column, PagedTable, Styler };
