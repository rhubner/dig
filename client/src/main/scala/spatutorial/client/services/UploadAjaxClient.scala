package spatutorial.client.services


import boopickle.Default._
import japgolly.scalajs.react._
import org.scalajs.dom
import org.scalajs.dom.File
import org.scalajs.dom.ext.Ajax
import spatutorial.shared._
import spatutorial.shared.MyCustomPickle._

import scala.concurrent.Future
import scala.scalajs.js.Dynamic._
import scala.scalajs.js.typedarray.{ArrayBuffer, TypedArrayBuffer}
import scalaz.Tree


/**
  * Created by rhubner on 19/06/17.
  */
object UploadAjaxClient {


  def doUpload(file: File): Future[Tree[SoubSystem]] = {
    import scala.concurrent.ExecutionContext.Implicits.global

    dom.ext.Ajax.put("/fileupload/droidProfile",
      file.asInstanceOf[Ajax.InputData],
      timeout = 11000,
      responseType = "arraybuffer"
    ).map { r =>
      val dataBuffer = TypedArrayBuffer.wrap(r.response.asInstanceOf[ArrayBuffer])
      Unpickle[Tree[SoubSystem]].fromBytes(dataBuffer)
    }

  }

}
