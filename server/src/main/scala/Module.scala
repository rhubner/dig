import com.google.inject.AbstractModule
import services.ApiService
import spatutorial.shared.Api

/**
  * Created by rhubner on 18/06/17.
  */
class Module extends AbstractModule {
  override def configure(): Unit = {
    bind(classOf[Api]).to(classOf[ApiService])


  }
}
