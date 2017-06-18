package spatutorial.client

import chandu0101.scalajs.react.components.ReactTable
import chandu0101.scalajs.react.components.materialui.{Mui, MuiList}
import japgolly.scalajs.react.ReactDOM
import japgolly.scalajs.react.extra.router._
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom
import spatutorial.client.components.ExplorerTreeView
import spatutorial.client.modules.HlavniStranka

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport
import scalacss.Defaults._
import scalacss.ScalaCssReact._
import scalacss.internal.mutable.GlobalRegistry

@JSExport("SPAMain")
object SPAMain extends js.JSApp {



  var mujRoot = <.div(
    <.h1("muj text"),
    <.p("prvni odstavec"),
//    ExplorerTreeView()
    HlavniStranka()

  )



  @JSExport
  def main(): Unit = {

    GlobalRegistry.register(ExplorerTreeView.Style)
    GlobalRegistry.addToDocumentOnRegistration()

    ReactDOM.render(mujRoot, dom.document.getElementById("root"))
  }
}
