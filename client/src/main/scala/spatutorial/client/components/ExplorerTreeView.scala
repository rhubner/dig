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


  sealed trait SoubSystem {
    def name: String
  }

  case class Slozka(name : String) extends SoubSystem
  case class Soubor(name: String) extends SoubSystem

  def slozka(name: String): SoubSystem = Slozka.apply(name)
  def soubor(name: String): SoubSystem = Soubor.apply(name)

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


  def createTree() : Tree[SoubSystem] = {
    import scalaz.Scalaz._

    val strom: Tree[SoubSystem] =
      slozka("folder1").node(

        soubor("financial report.docx").leaf,

        slozka("dalsi subfolder").node(
          soubor("ahoj.txt").leaf,
          soubor("prdel.doc").leaf
        ),


        soubor("ahoj2.txt").leaf,
        slozka("empty node").node()

      )

    strom

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


  def itemCallBack(itemLoc: TreeLoc[SoubSystem])(reactEvent: ReactEvent) = Callback {
    println("on lcick on element")
    println("target : " + itemLoc.tree.rootLabel)
  }



  def createTable(treeLoc: TreeLoc[SoubSystem]): ReactElement = {
    val files = treeLoc.tree.subForest.filter(x => x.rootLabel match {
      case Soubor(f) => true
      case _ => false
    }).map(x => x.rootLabel.name)


    MuiTable(key="tabulka")(
      MuiTableHeader(key="header")(
        MuiTableRow(key="row1")(
          MuiTableHeaderColumn(key="header1")("file neme"),
          MuiTableHeaderColumn(key="header2")("puid"),
          MuiTableHeaderColumn(key="header3")("closure")
        )
      ),
      MuiTableBody(key="table body")(
        files.map { file =>
          MuiTableRow(key=file)(
            MuiTableRowColumn(key="column1")(file),
            MuiTableRowColumn(key="column2")("fmt/100"),
            MuiTableRowColumn(key="column3")("open on transfer")
          )
        }
      )
    )

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
            createTable(createTree().loc)
        )


    )//div pro mui container

    )
  )
}).build


  def apply() = component2()


}
