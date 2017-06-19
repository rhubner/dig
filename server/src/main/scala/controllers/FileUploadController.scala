package controllers



import play.api.mvc._

import scala.util.Try
import boopickle.Default._
import play.api.Logger
import services.DroidDatabase

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits._

import spatutorial.shared._
import spatutorial.shared.MyCustomPickle._
import scala.concurrent._


/**
  * Created by rhubner on 19/06/17.
  */
class FileUploadController extends Controller {


  def upload = Action.async(parse.temporaryFile) { request =>

    Future {
      blocking {
        val result = DroidDatabase.transformDroid(request.body.file)

        val buffer = Pickle.intoBytes(result)
        val data = Array.ofDim[Byte](buffer.remaining())
        buffer.get(data)

        Ok(data)
      }
    }
  }


}
