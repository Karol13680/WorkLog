import './WorkLog.scss';

import Header from '../../components/header/Header';
import InfoSection from './section/info/InfoSection';
import TaskTable from '../../components/taskTable/Tasktable';

const WorkLog = () => {
  return (
    <>
      <Header />
      <InfoSection />
      <TaskTable />
    </>
  )
}

export default WorkLog;