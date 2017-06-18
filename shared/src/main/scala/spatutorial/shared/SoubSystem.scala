package spatutorial.shared

import scalaz.Tree

/**
  * Created by rhubner on 18/06/17.
  */
sealed trait SoubSystem {
  def name: String
}

case class Slozka(name : String) extends SoubSystem
case class Soubor(name: String) extends SoubSystem


case class Wrapper(strom: Tree[Slozka])
