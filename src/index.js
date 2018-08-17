import Table from "./components/table";
import Column from "./components/column";
import "./css/package.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faCheckCircle, faSortUp, faSortDown, faFilter, faAngleUp, faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

library.add(faSort, faCircle, faCheckCircle, faSortUp, faSortDown, faFilter, faAngleUp, faAngleDown, faTimes);

export { Table, Column };
