import Table from "./components/table";
import Column from "./components/column";
import "./css/package.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

library.add(faSort, faSortUp, faSortDown);

export { Table, Column };
