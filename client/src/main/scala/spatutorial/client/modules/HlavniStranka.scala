package spatutorial.client.modules

import japgolly.scalajs.react.{BackendScope, ReactComponentB}
import spatutorial.shared.{Api, SoubSystem}
import spatutorial.client.services.AjaxClient
import japgolly.scalajs.react._
import japgolly.scalajs.react.vdom.prefix_<^._
import autowire._
import diode.util.RunAfterJS
import spatutorial.shared.MyCustomPickle._
import boopickle.Default._
import spatutorial.client.components.ExplorerTreeView

import scala.scalajs.concurrent.JSExecutionContext.Implicits.queue
import scalaz.Tree

/**
  * Created by rhubner on 18/06/17.
  */
object HlavniStranka {

  case class Props(name: String)
  case class State(tree: Option[Tree[SoubSystem]])


  class Backend(t: BackendScope[Props, State]) {


    def loadItemCallback() = Callback.future {

      val remoteCall = AjaxClient[Api].getTree().call()
        .map(x => t.setState(State(Some(x))))

      remoteCall.map(x =>{
        println("volani provedeno")
        x
      })
    }



    def render(p: Props, s: State) = {
      <.div(
        <.button(^.onClick --> loadItemCallback)("tlacitko"),

        if(s.tree.isDefined) {
          ExplorerTreeView(s.tree.get)
        }else {
          <.div("nic")
        }
      )
    }




  }



  val component = ReactComponentB[Props]("HlavniStranka")
    .initialState(State(None))
    .renderBackend[Backend]
    .build


  def apply() = component(Props("xx"))


}
