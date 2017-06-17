package spatutorial.client.components

import chandu0101.scalajs.react.components.materialui.{MuiTableHeaderColumn, _}
import japgolly.scalajs.react.{ReactComponentB, ReactElement}
import japgolly.scalajs.react.vdom.prefix_<^._

import scalacss.internal.mutable.StyleSheet
import scalacss.Defaults._
import scalacss.ScalaCssReact._


/**
  * Created by rhubner on 15/06/17.
  */
object ExplorerTreeView {

  import chandu0101.scalajs.react.components.Implicits._

  import Mui.SvgIcons.{ActionGrade, ActionInfo, ContentDrafts, ContentInbox, ContentSend, FileFolder, FileFolderShared, FileAttachment}

  import scala.scalajs.js._

  import japgolly.scalajs.react.vdom._

  import scala.scalajs.js.JSConverters._


  import scalaz.Tree


  object Style extends StyleSheet.Inline {

    import dsl._

    val leftMenu = style(
      float.left,
      width(25.%%)
    )

    val fileTable = style(
      float.left,
      width(75.%%)
    )

  }
  

  def createTree() : Tree[String] = {
    import scalaz.Scalaz._

    val strom: Tree[String] =
      "folder1".node(
        "financial report.docx".leaf,
        "dalsi subfolder".node(
          "ahoj.txt".leaf,
          "prdel.doc".leaf
        ),
        "ahoj2.txt".leaf,
        "empty node".node()

      )

    strom

  }


  def createListItem(node: Tree[String]): ReactElement = {
    val subforest = node.subForest.toList
    val isNode = node.loc

//    node match {
//      case Tree.Node(root, forest) => ""
//      case Tree.Leaf(root) => ""
//    }

    if(subforest.isEmpty) {
      MuiListItem(key = node.rootLabel, primaryText = node.rootLabel, leftIcon = FileAttachment()())()
    }else {
      val subtree = subforest.map(x => createListItem(x)).toSeq.toJsArray
      val subitems = UndefOr.any2undefOrA(subtree)
      MuiListItem(key = node.rootLabel, primaryText = node.rootLabel, nestedItems = subitems,
        leftIcon = FileFolder()(), initiallyOpen = true)()
    }
  }



  val component2 = ReactComponentB[Unit]("ExplorerTreeView")
    .render(P => {
      <.div("hello",
        MuiMuiThemeProvider()(
          <.div(
          <.div(Style.leftMenu, ^.id:= "mujdiv")(
          MuiList(key = "list1")(
            createListItem(createTree())
        )

      ),//div pro menu end
        <.div(Style.fileTable, ^.id:= "dabulkaDiv")(
            MuiTable(key="tabulka")(
            MuiTableHeader(key="header")(
              MuiTableRow(key="row1")(
                MuiTableHeaderColumn(key="header1")("file neme"),
                MuiTableHeaderColumn(key="header2")("puid"),
                MuiTableHeaderColumn(key="header3")("closure")
              )
            ),
            MuiTableBody(key="table body")(
              MuiTableRow(key="row1")(
                MuiTableRowColumn(key="column1")("file.txt"),
                MuiTableRowColumn(key="column2")("fmt/100"),
                MuiTableRowColumn(key="column3")("open on transfer")
              )
            )
          )
        )


    )//div pro mui container

    )
  )
}).build


  def apply() = component2()


}
