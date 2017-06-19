package services

import java.io.File

import org.scalatest.{FlatSpec, Matchers}
import play.api.Logger

/**
  * Created by rhubner on 19/06/17.
  */
class DroidDatabaseTest extends FlatSpec with Matchers {

  val log = Logger(this.getClass)


  "droid database " should "unzip droid file" in {

    val res = DroidDatabase.unzip(new File("/home/rhubner/droid/export/droid-sample.droid"))

    log.warn(s"expanded directory : ${res.getAbsolutePath}")

    "1".toInt should be (1)

  }



}
