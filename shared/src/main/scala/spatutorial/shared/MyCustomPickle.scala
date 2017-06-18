package spatutorial.shared

import java.nio.ByteBuffer

import boopickle.{PickleState, PicklerHelper, UnpickleState}

import scalaz.Tree
import scalaz.Scalaz._

import boopickle.Default._

/**
  * Created by rhubner on 18/06/17.
  */
object MyCustomPickle extends PicklerHelper {

  implicit object treePickler extends P[Tree[SoubSystem]] {

    override def pickle(obj: Tree[SoubSystem])(implicit state: PickleState): Unit = {
      val rootLabel = obj.rootLabel
      val subForest = obj.subForest.toList

      rootLabel match {
        case x : Soubor => {
          state.enc.writeInt(0)
          state.pickle(x)
        }
        case z : Slozka => {
          state.enc.writeInt(1)
          state.pickle(z)
        }
      }

      if(subForest.isEmpty) {
        state.enc.writeInt(0)
      }else {
        state.enc.writeInt(1)
        state.pickle(subForest)
      }


    }


    override def unpickle(implicit state: UnpickleState): Tree[SoubSystem] = {

      val trida = state.dec.readInt

      val rootLabel = if(trida == 0) {
        val soubor = state.unpickle[Soubor].asInstanceOf[SoubSystem]
        soubor

      }else {
        val slozka = state.unpickle[Slozka].asInstanceOf[SoubSystem]
        slozka
      }

      val hasForest = state.dec.readInt

      val forest = if(hasForest == 0) {
        List.empty[Tree[SoubSystem]]
      }else {
        state.unpickle[List[Tree[SoubSystem]]]
      }

      Tree.Node(rootLabel, forest.toStream)

    }
  }



}
