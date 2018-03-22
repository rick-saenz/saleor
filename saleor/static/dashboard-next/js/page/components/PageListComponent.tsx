import VisibilityIcon from "material-ui-icons/Visibility";
import blue from "material-ui/colors/blue";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from "material-ui/Table";
import * as React from "react";
import { Link } from "react-router-dom";

import Skeleton from "../../components/Skeleton";
import TablePagination from "../../components/TablePagination";
import { PageListQuery } from "../../gql-types";
import i18n from "../../i18n";

interface PageListComponentProps {
  pages: PageListQuery["pages"]["edges"];
  pageInfo: PageListQuery["pages"]["pageInfo"];
  loading: boolean;
  handlePreviousPage();
  handleNextPage();
  editPageUrl(id: string);
  showPageUrl(slug: string);
}

const decorate = withStyles({
  link: {
    color: blue[500],
    textDecoration: "none"
  },
  textRight: {
    textAlign: "right"
  }
});

export const PageListComponent = decorate<PageListComponentProps>(
  ({
    classes,
    handlePreviousPage,
    handleNextPage,
    editPageUrl,
    showPageUrl,
    pages,
    pageInfo,
    loading
  }) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{i18n.t("Name", { context: "object" })}</TableCell>
          <TableCell>{i18n.t("Url", { context: "object" })}</TableCell>
          <TableCell>{i18n.t("Visibility", { context: "object" })}</TableCell>
          <TableCell className={classes.textRight}>
            {i18n.t("Actions", { context: "object" })}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={4}
            hasNextPage={pageInfo ? pageInfo.hasNextPage : false}
            onNextPage={handleNextPage}
            hasPreviousPage={pageInfo ? pageInfo.hasPreviousPage : false}
            onPreviousPage={handlePreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
          </TableRow>
        ) : pages.length > 0 ? (
          pages.map(edge => (
            <TableRow key={edge.node.id}>
              <TableCell>
                <Link to={editPageUrl(edge.node.id)} className={classes.link}>
                  {edge.node.title}
                </Link>
              </TableCell>
              <TableCell>{`/${edge.node.slug}`}</TableCell>
              <TableCell>
                {edge.node.isVisible
                  ? i18n.t("Published", { context: "object" })
                  : i18n.t("Not published", { context: "object" })}
              </TableCell>
              <TableCell className={classes.textRight}>
                <IconButton
                  component={props => (
                    <a
                      href={showPageUrl(edge.node.slug)}
                      target="_blank"
                      {...props}
                    />
                  )}
                >
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3}>{i18n.t("No pages found")}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
);

export default PageListComponent;