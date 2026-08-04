const DashboardCard = (props) => {
  return (
    <article className='dashboard-card'>
      <p>{props.title}</p>
      <strong>{props.value}</strong>
    </article>
  )
}

export default DashboardCard
