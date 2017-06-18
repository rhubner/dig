package spatutorial.shared

import boopickle.Default._
import org.scalatest.{FlatSpec, Matchers}
import play.api.Logger
import services.ApiService
import spatutorial.shared.MyCustomPickle._
import boopickle.Default._

import scalaz.Tree

/**
  * Created by rhubner on 18/06/17.
  */
class TestSerialization extends FlatSpec with Matchers {

  val log = Logger(this.getClass)


  val api = new ApiService


  "boopiclke" should "serialise simple tree" in {

    val strom = api.getTree()

    val buffer = Pickle.intoBytes(strom)

    log.info(s"serializovana data : ${buffer}")

    "1".toInt should be (1)
  }


  "boopiclke" should "serialise and deserialise tree" in {

    val strom = api.getTree()

    val buffer = Pickle.intoBytes(strom)

    log.info(s"serializovana data : ${buffer.array()}")


    val res = Unpickle[Tree[SoubSystem]].fromBytes(buffer)

    log.info(s"response : ${res.toStrictTree}")


    "1".toInt should be (1)
  }




}
