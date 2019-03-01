import Table from "./components/table";
import Column from "./components/column";
import PagedTable from "./components/pagedtable";
import Styler from "./components/rowstyler";
import Selectable from "./components/selectable";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faSortUp, faSortDown, faFilter, faBackward, faFastBackward, faForward, faFastForward } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

library.add(faSort, faSortUp, faSortDown, faFilter, faBackward, faFastBackward, faForward, faFastForward, faCheckSquare, faSquare);

const mountFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const intFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const rateFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

const mountFormat = o => mountFormatter.format(o);
const moneyFormat = o => moneyFormatter.format(o);
const intFormat = o => intFormatter.format(o);
const rateFormat = o => rateFormatter.format(o);

export { Table, Column, PagedTable, Styler, Selectable, mountFormat, moneyFormat, intFormat, rateFormat };
