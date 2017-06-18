package services

import java.util.{Date, UUID}
import javax.inject.{Inject, Singleton}

import play.api.db.Database
import spatutorial.shared._

import scalaz.Tree
import anorm._

@Singleton()
class ApiService @Inject() (db: Database) extends Api {
  var todos = Seq(
    TodoItem("41424344-4546-4748-494a-4b4c4d4e4f50", 0x61626364, "Wear shirt that says “Life”. Hand out lemons on street corner.", TodoLow, completed = false),
    TodoItem("2", 0x61626364, "Make vanilla pudding. Put in mayo jar. Eat in public.", TodoNormal, completed = false),
    TodoItem("3", 0x61626364, "Walk away slowly from an explosion without looking back.", TodoHigh, completed = false),
    TodoItem("4", 0x61626364, "Sneeze in front of the pope. Get blessed.", TodoNormal, completed = true)
  )

  override def welcomeMsg(name: String): String =
    s"Welcome to SPA, $name! Time is now ${new Date}"

  override def getAllTodos(): Seq[TodoItem] = {
    // provide some fake Todos
    Thread.sleep(300)
    println(s"Sending ${todos.size} Todo items")
    todos
  }

  // update a Todo
  override def updateTodo(item: TodoItem): Seq[TodoItem] = {
    // TODO, update database etc :)
    if(todos.exists(_.id == item.id)) {
      todos = todos.collect {
        case i if i.id == item.id => item
        case i => i
      }
      println(s"Todo item was updated: $item")
    } else {
      // add a new item
      val newItem = item.copy(id = UUID.randomUUID().toString)
      todos :+= newItem
      println(s"Todo item was added: $newItem")
    }
    Thread.sleep(300)
    todos
  }

  // delete a Todo
  override def deleteTodo(itemId: String): Seq[TodoItem] = {
    println(s"Deleting item with id = $itemId")
    Thread.sleep(300)
    todos = todos.filterNot(_.id == itemId)
    todos
  }

  override def getTree(): Tree[SoubSystem] = {
    buildTree(None, "ROOT")

  }



  def buildTree(parentId: Option[Long], nodeName: String): Tree[SoubSystem] = {
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


def loadNodes(parentId: Option[Long]): List[ProfileNode] = {
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




}
