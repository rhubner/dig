package services

import java.io.File
import java.nio.file.Files

import anorm._
import org.apache.commons.compress.archivers.zip.ZipFile
import org.apache.commons.io.FileUtils
import play.api.db.{Database, Databases}
import spatutorial.shared.{Slozka, SoubSystem, Soubor}

import scalaz.Tree

/**
  * Created by rhubner on 19/06/17.
  */
object DroidDatabase {


  def transformDroid(file: File): Tree[SoubSystem] = {

    val dbDirectory = unzip(file)

    inMemmory(dbDirectory)

  }


  def inMemmory(dbDirectory: File): Tree[SoubSystem] = {
    Databases.withDatabase("org.apache.derby.jdbc.EmbeddedDriver", s"jdbc:derby:${dbDirectory.getAbsolutePath}", dbDirectory.getParentFile.getName,
      Map("username" -> "DROID_USER")) { implicit database =>
      buildTree(None, "ROOT")
    }

  }


  def buildTree(parentId: Option[Long], nodeName: String)(implicit database: Database): Tree[SoubSystem] = {
    import scalaz.Scalaz._

    def slozka(name: String): SoubSystem = Slozka.apply(name)
    def soubor(name: String, puid: String, fileSize: Long): SoubSystem = Soubor.apply(name, puid, fileSize)


    val nodes = loadNodes(parentId)
    val dirs = nodes.filter(_.resourceType == 0)

    val files = nodes.filter(_.resourceType != 0).map(x => soubor(x.name, x.puid, x.fileSize.getOrElse(-1)).leaf)


    val subforest = dirs.map(x => {
      buildTree(Some(x.id), x.name)
    })

    Tree.Node(slozka(nodeName), (files ++ subforest).toStream)

  }


  def loadNodes(parentId: Option[Long])(implicit db: Database): List[ProfileNode] = {
    import anorm.SqlParser.{ str, long, int, get}

    val parser = long("node_id") ~ str("name") ~ int("resource_type") ~ str("PUID") ~ get[Option[Long]]("parent_id") ~ get[Option[Long]]("file_size") map {
      case nodeId ~ name ~ resourceType ~ puid ~ parentId ~ fileSize => ProfileNode(nodeId, name, resourceType, puid, parentId, fileSize)
    }

    db.withConnection { implicit c =>

      val sql = if(parentId.isDefined) {
        SQL("""select node.node_id, node.name, node.resource_type, ide.PUID, node.parent_id, node.FILE_SIZE
             from PROFILE_RESOURCE_NODE node join IDENTIFICATION ide on ide.NODE_ID = node.NODE_ID
             where parent_ID = {parentId} order by name""").on('parentId -> parentId.get)
      }else {
        SQL("""select node.node_id, node.name, node.resource_type, ide.PUID, node.parent_id, node.FILE_SIZE
             from PROFILE_RESOURCE_NODE node join IDENTIFICATION ide on ide.NODE_ID = node.NODE_ID
             where parent_ID is null order by name""").on()
      }

      val res = sql
        .executeQuery().as(parser.*)
      res
    }

  }


  case class ProfileNode(id: Long, name: String, resourceType: Int, puid: String, parentId: Option[Long], fileSize: Option[Long] )


  def unzip(file: File): File = {

    val dbDir = Files.createTempDirectory("droidTemp").toFile

    val zipFile = new ZipFile(file)


    val entries = zipFile.getEntriesInPhysicalOrder


    while (entries.hasMoreElements) {
      val entry = entries.nextElement()

      if(!entry.isDirectory) {
        val outputFile = new File(dbDir, entry.getName)
        if(!outputFile.getParentFile.exists()) {
          outputFile.getParentFile.mkdirs()
        }
        FileUtils.copyInputStreamToFile(zipFile.getInputStream(entry), outputFile)
      }
    }

    zipFile.close()

    new File(dbDir, "db")
  }

}
