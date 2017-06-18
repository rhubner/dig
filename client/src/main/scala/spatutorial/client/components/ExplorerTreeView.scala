package spatutorial.client.components

import chandu0101.scalajs.react.components.ReactEventB
import chandu0101.scalajs.react.components.materialui.{MuiTableHeaderColumn, _}
import japgolly.scalajs.react.{ReactComponentB, ReactElement}
import japgolly.scalajs.react.vdom.prefix_<^._

import scala.scalajs.js
import scalacss.internal.mutable.StyleSheet
import scalacss.Defaults._
import scalacss.ScalaCssReact._
import scalaz.TreeLoc
import japgolly.scalajs.react.Callback
import spatutorial.shared._
import japgolly.scalajs.react._


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


  case class Props(tree: Tree[SoubSystem])
  case class State(treeLoc: TreeLoc[SoubSystem])

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





  class Backend(t: BackendScope[Props, State]) {

    def itemCallBack(itemLoc: TreeLoc[SoubSystem])(reactEvent: ReactEvent) = {
      t.modState(x => State(itemLoc)) >> Callback.log("message")

    }


    def createListItem(node: Tree[SoubSystem]): ReactElement = {
      assert(node.rootLabel.isInstanceOf[Slozka], "Root element must be Slozka")

      //val subtree = forest.filter(!_.).map(x => createListItem(x)).toJsArray
      val subtree = node.subForest.filter(x => x.rootLabel match {
        case Slozka(_) => true
        case _ => false
      }).map(x => createListItem(x)).toJsArray

      val subitems: js.UndefOr[js.Array[ReactElement]] = if(subtree.isEmpty) {
        js.undefined
      }else {
        UndefOr.any2undefOrA(subtree)
      }


      MuiListItem(key = node.rootLabel.name, primaryText = node.rootLabel.name, nestedItems = subitems,
        leftIcon = FileFolder()(), initiallyOpen = true, onClick = UndefOr.any2undefOrA(itemCallBack(node.loc)))()

    }


    def createTable(treeLoc: TreeLoc[SoubSystem]): ReactElement = {
      val files = treeLoc.tree.subForest.filter(x => x.rootLabel match {
        case s: Soubor => true
        case _ => false
      }).map(x => x.rootLabel.asInstanceOf[Soubor])


      MuiTable(key="tabulka")(
        MuiTableHeader(key="header")(
          MuiTableRow(key="row1")(
            MuiTableHeaderColumn(key="header1")("file neme"),
            MuiTableHeaderColumn(key="header2")("puid"),
            MuiTableHeaderColumn(key="header3")("file size"),
            MuiTableHeaderColumn(key="header4")("closure")
          )
        ),
        MuiTableBody(key="table body")(
          files.map { file =>
            MuiTableRow(key=file.name)(
              MuiTableRowColumn(key="column1")(file.name),
              MuiTableRowColumn(key="column2")(file.puid),
              MuiTableRowColumn(key="column2")(file.fileSize),
              MuiTableRowColumn(key="column3")("open on transfer")
            )
          }
        )
      )
    }

    def render(p: Props, s: State) = {
      <.div("hello",
        MuiMuiThemeProvider()(
          <.div(
            <.div(Style.leftMenu, ^.id:= "mujdiv")(
              MuiList(key = "list1")(
                createListItem(p.tree)
              )
            ),//div pro menu end
            <.div(Style.fileTable, ^.id:= "dabulkaDiv")(
              createTable(s.treeLoc)
            )
          )//div pro mui container
        )
      )
    }
  }


  val component = ReactComponentB[Props]("ExplorerTreeView")
    .initialState_P(p => State(p.tree.loc))
    .renderBackend[Backend]
    .build

  def apply(strom: Tree[SoubSystem]) = component(Props(strom))


}
