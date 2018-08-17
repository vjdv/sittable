import Table from "./components/table";
import Column from "./components/column";
import "./css/package.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faCheckCircle, faSortUp, faSortDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

console.log(faCheckCircle);

library.add(faSort, faCircle, faCheckCircle, faSortUp, faSortDown, faFilter);

export { Table, Column };
