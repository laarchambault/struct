class UserSerializer < ActiveModel::Serializer
  attributes :id, :f_name, :l_name, :email, :phone, :company, :company_phone, :company_email, :jobs

  def jobs
    user = current_user
    jobs_with_permission = user.jobs.map do |job| 
      user_job = UserJob.find_by(user_id: user.id, job_id: job.id)
      copy_job = job.as_json
      if user_job && user_job.permission 
        copy_job["permission"] = user_job.permission
      elsif user_job
        copy_job["permission"] = nil
      end
      copy_job
    end
    jobs_with_permission
  end

end
